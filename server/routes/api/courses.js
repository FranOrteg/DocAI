const router = require('express').Router();
const { createCourse, getCoursesByUserId } = require('../../models/courses.model');
const { checkToken } = require('../../helpers/middlewares');

// Crear curso
router.post('/', checkToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        const user_id = req.user.id;

        const [result] = await createCourse({ user_id, name, description });
        res.json({ success: 'Curso creado', courseId: result.insertId });
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

// Obtener cursos del profesor logueado
router.get('/', checkToken, async (req, res) => {
    try {
        const user_id = req.user.id;
        const [courses] = await getCoursesByUserId(user_id);
        res.json(courses);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

module.exports = router;
