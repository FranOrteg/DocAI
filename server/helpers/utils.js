const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
    const obj = {
        user_id: user.id,
        role: user.role,
        exp: dayjs().add(7, 'days').unix()
    }
    return jwt.sign(obj, process.env.JWT_SECRET);
}

module.exports = {
    createToken
}