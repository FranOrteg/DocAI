const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { checkToken } = require('../../helpers/middlewares');
const { saveDocument, getDocumentsByCourse, updateDocumentStatus } = require('../../models/document.model');
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

    // 1. Guardar en base de datos
    const docData = {
      user_id: userId,
      course_id: courseId,
      filename: file.originalname,
      filepath: file.filename,
      type: file.mimetype
    };

    const [result] = await saveDocument(docData);
    const docId = result.insertId;

    // 2. Leer archivo y obtener curso
    const fullPath = path.join(__dirname, '../../uploads', file.filename);
    const fileStream = fs.createReadStream(fullPath);
    const [courseRows] = await getCourseById(courseId);
    const course = courseRows[0];

    if (!course?.vector_store_id) {
      return res.status(400).json({ fatal: 'El curso no tiene vector_store asociado' });
    }

    // 3. Subir a OpenAI
    console.log('📂 Subiendo archivo a OpenAI...');
    const uploadedFile = await openai.files.create({ file: fileStream, purpose: 'assistants' });
    console.log('📄 Archivo subido con ID:', uploadedFile.id);

    // 4. Vincular al vector store
    console.log('📎 Vinculando archivo al vector store...');
    await openai.vectorStores.files.create(course.vector_store_id, {
      file_id: uploadedFile.id
    });
    console.log('✅ Archivo vinculado');

    // 5. Actualizar estado
    await updateDocumentStatus(docId, 'uploaded');

    res.json({ success: 'Archivo subido y vinculado al vector store', docId });
  } catch (err) {
    console.error('❌ Error al subir documento:', err);
    res.status(500).json({ fatal: err.message }); 
  }
});

module.exports = router;
