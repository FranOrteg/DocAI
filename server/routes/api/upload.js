// routes/api/upload.js
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { checkToken } = require('../../helpers/middlewares');
const { saveDocument, updateDocumentStatus } = require('../../models/document.model');
const { readTextFromFile } = require('../../helpers/fileReader');
const { splitTextIntoChunks } = require('../../helpers/textProcessor');
const { getCourseById } = require('../../models/courses.model');
const openai = require('../../config/openai');

// Configuración del almacenamiento local con multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/:courseId', checkToken, upload.single('document'), async (req, res) => {
  try {
    const file = req.file;
    const course_id = req.params.courseId;
    const user_id = req.user.id;

    if (!file) return res.status(400).json({ fatal: 'No se ha subido ningún archivo' });

    const docData = {
      user_id,
      course_id,
      filename: file.originalname,
      filepath: file.filename,
      type: file.mimetype
    };

    const [result] = await saveDocument(docData);
    const docId = result.insertId;

    const fullPath = path.join(__dirname, '../../uploads', file.filename);
    const fileStream = fs.createReadStream(fullPath);

    // Obtener el curso con vector_store_id
    const [courseRows] = await getCourseById(course_id);
    const course = courseRows[0];

    if (!course.vector_store_id) {
      return res.status(400).json({ fatal: 'El curso no tiene vector_store asociado' });
    }

    // Subir archivo al vector store
    const uploadedFile = await openai.files.create({ file: fileStream, purpose: 'assistants' });

    await openai.beta.vectorStores.files.create(course.vector_store_id, {
      file_id: uploadedFile.id
    });

    await updateDocumentStatus(docId, 'uploaded');

    res.json({ success: 'Archivo subido y vinculado al vector store', docId });
  } catch (error) {
    console.error('❌ Error al subir documento:', error);
    res.status(500).json({ fatal: error.message });
  }
});

module.exports = router;
