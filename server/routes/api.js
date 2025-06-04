const router = require('express').Router();

// AccessToken
router.use('/user', require('./api/user'));

// Cursos
router.use('/courses', require('./api/courses'));

// Chat
router.use('/chat', require('./api/chat'));

// Documentos
router.use('/documents', require('./api/documents'));


module.exports = router;