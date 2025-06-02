const router = require('express').Router();

// AccessToken
router.use('/user', require('./api/user'));

// Cursos
router.use('/courses', require('./api/courses'));

// Documentos
router.use('/upload', require('./api/upload'));


module.exports = router;