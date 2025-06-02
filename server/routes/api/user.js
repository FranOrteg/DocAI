const router = require('express').Router();

const { createToken } = require('../../helpers/utils');
const { getByEmail } = require('../../models/user.model');


// Login para User
router.post('/login', async (req, res) => {
	try {
        const [result] = await getByEmail(req.body.email);
        // Si no existe el usuario
        if (result.length === 0) {
            return res.json({ fatal: 'Error usuario no registrado' });
        }

        const usuario = result[0];

        res.json({
            success: 'Bienvenido',
            token: createToken(usuario)
        });

    } catch (error) {
        res.json({ fatal: error.message });
    }
});

module.exports = router;