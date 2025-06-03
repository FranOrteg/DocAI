const router = require('express').Router();

// AccessToken
router.use('/user', require('./api/user'));

// Cursos
router.use('/courses', require('./api/courses'));

// Subir Documentos
router.use('/upload', require('./api/upload'));

// Chat
router.use('/chat', require('./api/chat'));

// Documentos
router.use('/documents', require('./api/documents'));


module.exports = router;