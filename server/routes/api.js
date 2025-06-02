const router = require('express').Router();

// AccessToken
router.use('/user', require('./api/user'));


module.exports = router;