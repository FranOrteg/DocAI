const router = require('express').Router();
const { getDocumentsByCourse } = require('../../models/document.model');
const { checkToken } = require('../../helpers/middlewares');

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

module.exports = router;
