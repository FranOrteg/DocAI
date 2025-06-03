const router = require('express').Router();
const { getDocumentsByCourse } = require('../../models/document.model');
const { checkToken } = require('../../helpers/middlewares');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { saveDocument } = require('../../models/document.model');

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

router.post('/:courseId', checkToken, upload.single('document'), async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ fatal: 'No se ha subido ningún archivo' });
    }

    const filepath = file.filename;
    const filename = file.originalname;
    const type = file.mimetype;

    await saveDocument({
      user_id: userId,
      course_id: courseId,
      filename,
      filepath,
      type
    });

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('❌ Error al subir documento:', err);
    res.status(500).json({ fatal: 'Error al subir documento' });
  }
});

module.exports = router;
