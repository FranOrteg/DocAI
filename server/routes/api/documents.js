const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { checkToken } = require('../../helpers/middlewares');
const {
  saveDocument,
  getDocumentsByCourse,
  updateDocumentStatus,
  getDocumentById,
  deleteDocumentById
} = require('../../models/document.model');
const { getCourseById } = require('../../models/courses.model');
const openai = require('../../config/openai');

// 📁 Configuración de multer (almacenamiento local)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s/g, '_');
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });

// 📥 GET: Obtener documentos de un curso
router.get('/courses/:courseId', checkToken, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const [docs] = await getDocumentsByCourse(courseId);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const docsWithUrl = docs.map(doc => ({
      ...doc,
      url: `${baseUrl}/uploads/${doc.filepath}`
    }));

    res.json(docsWithUrl);
  } catch (err) {
    console.error('❌ Error al obtener documentos del curso:', err);
    res.status(500).json({ fatal: 'Error al obtener documentos del curso' });
  }
});

// 📤 POST: Subir documento y vincular a vector store
router.post('/:courseId', checkToken, upload.single('document'), async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ fatal: 'No se ha subido ningún archivo' });
    }

    // Leer archivo y obtener curso
    const fullPath = path.join(__dirname, '../../uploads', file.filename);
    const fileStream = fs.createReadStream(fullPath);
    const [courseRows] = await getCourseById(courseId);
    const course = courseRows[0];

    if (!course?.vector_store_id) {
      return res.status(400).json({ fatal: 'El curso no tiene vector_store asociado' });
    }

    // Subir a OpenAI
    console.log('📂 Subiendo archivo a OpenAI...');
    const uploadedFile = await openai.files.create({ file: fileStream, purpose: 'assistants' });
    console.log('📄 Archivo subido con ID:', uploadedFile.id);

    // Vincular al vector store
    console.log('📎 Vinculando archivo al vector store...');
    await openai.beta.vectorStores.files.create(course.vector_store_id, {
      file_id: uploadedFile.id
    });
    console.log('✅ Archivo vinculado');

    // Guardar en base de datos
    const docData = {
      user_id: userId,
      course_id: courseId,
      filename: file.originalname,
      filepath: file.filename,
      type: file.mimetype,
      status: 'uploaded',
      openai_file_id: uploadedFile.id // este es el ID correcto
    };

    const [result] = await saveDocument(docData);
    const docId = result.insertId;

    // 5. Actualizar estado
    await updateDocumentStatus(docId, 'uploaded');

    res.json({ success: 'Archivo subido y vinculado al vector store', docId });
  } catch (err) {
    console.error('❌ Error al subir documento:', err);
    res.status(500).json({ fatal: err.message });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', checkToken, async (req, res) => {
  const documentId = req.params.id;

  try {
    // 1. Obtener info del documento
    const [docRows] = await getDocumentById(documentId);
    if (docRows.length === 0) {
      return res.status(404).json({ fatal: 'Documento no encontrado' });
    }
    const doc = docRows[0];

    // 2. Obtener vector_store_id del curso
    let vectorStoreId = null;
    if (doc.course_id) {
      const [courseRows] = await getCourseById(doc.course_id);
      vectorStoreId = courseRows?.[0]?.vector_store_id;
    }

    // 4. Eliminar de OpenAI si existe openai_file_id
    if (doc.openai_file_id?.startsWith('file-')) {
      try {
        // Primero desvincular del vector store (si existe)
        if (vectorStoreId?.startsWith('vs_')) {
          await openai.beta.vectorStores.files.del(vectorStoreId, doc.openai_file_id);
          console.log(`🔗 Desvinculado del vector store: ${vectorStoreId}`);
        }

        // Luego borrar el archivo
        await openai.files.del(doc.openai_file_id);
        console.log(`🗑 Archivo de OpenAI eliminado: ${doc.openai_file_id}`);
      } catch (err) {
        console.warn(`⚠️ No se pudo eliminar archivo de OpenAI: ${err.message}`);
      }
    }

    // 5. Eliminar archivo físico si existe
    const filePath = path.join(__dirname, '../../uploads', doc.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 6. Eliminar de la BD
    await deleteDocumentById(documentId);

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al borrar documento:', error);
    res.status(500).json({ fatal: 'Error interno al borrar documento' });
  }
});


module.exports = router;
