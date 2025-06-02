const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
    const obj = {
        user_id: user.id,
        role: user.rol,
        exp: dayjs().add(7, 'days').unix()
    }
    return jwt.sign(obj, 'clave fuerte');
}

module.exports = {
    createToken
}