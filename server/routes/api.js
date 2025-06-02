const router = require('express').Router();

// AccessToken
router.use('/auth', require('./api/auth'));


module.exports = router;