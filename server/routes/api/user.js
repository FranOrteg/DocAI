const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { createToken } = require('../../helpers/utils');
const { getByEmail, createUser, getAllUsers, deleteUserById, updateUser } = require('../../models/user.model');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const [users] = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
    try {
        await deleteUserById(req.params.id);
        res.json({ success: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
});

// Registro User
router.post('/register', async (req, res) => {
    try {
        const [result] = await getByEmail(req.body.email);

        // Si existe el usuario
        if (result.length > 0) {
            return res.json({ fatal: 'Error, usuario ya registrado' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            ...req.body,
            password: hashedPassword
        };

        const [newUser] = await createUser(userData);
        res.json({ success: 'Usuario registrado', id: newUser.insertId });
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

// Login para User
router.post('/login', async (req, res) => {
    try {
        const [result] = await getByEmail(req.body.email);

        // Si no existe el usuario
        if (result.length === 0) {
            return res.json({ fatal: 'Error usuario no registrado' });
        }

        const usuario = result[0];

        // 🔐 Verificar la contraseña
        const match = await bcrypt.compare(req.body.password, usuario.password);
        if (!match) {
            return res.json({ fatal: 'Credenciales incorrectas' });
        }

        res.json({
            success: 'Bienvenido',
            token: createToken(usuario)
        });

    } catch (error) {
        res.json({ fatal: error.message });
    }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
    try {
        let updatedData = { ...req.body };

        // Si se envía una nueva contraseña, la ciframos
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }

        await updateUser(req.params.id, updatedData);
        res.json({ success: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
});



module.exports = router;