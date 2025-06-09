const jwt = require('jsonwebtoken');
const { getById } = require('../models/user.model');


const checkToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Falta o formato incorrecto de autorización' });
    }

    const token = authHeader.split(' ')[1]; 

    let obj;
    try {
        obj = jwt.verify(token, process.env.JWT_SECRET); 
    } catch (error) {
        return res.status(403).json({ error: 'El token no es correcto' });
    }

    const [user] = await getById(obj.user_id);
    req.user = user[0];

    next();
};


const checkUser = (req, res, next) => {
    const rolesPermitidos = ['Administrador', 'Profesor', 'Alumno'];
    if (!rolesPermitidos.includes(req.user.rol)) {
        return res.json({ fatal: 'El usuario no tiene permisos válidos' });
    }
    next();
};


module.exports = {
    checkToken,
    checkUser
}