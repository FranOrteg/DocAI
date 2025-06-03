const router = require('express').Router();
const { createCourse, getCoursesByUserId } = require('../../models/courses.model');
const { checkToken } = require('../../helpers/middlewares');
const { createAssistantForCourse, createVectorStore } = require('../../services/assistant.service'); 


// Crear curso
router.post('/', checkToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        const user_id = req.user.id;

        // 🧠 1. Crear vector store y assistant
        const vectorStoreId = await createVectorStore();
        const assistantId = await createAssistantForCourse(vectorStoreId, name);

        // 🧠 2. Crear curso con IDs asociados
        const [result] = await createCourse({
            user_id,
            name,
            description,
            assistant_id: assistantId,
            vector_store_id: vectorStoreId
        });

        res.json({ success: 'Curso creado', courseId: result.insertId, assistantId, vectorStoreId });
    } catch (error) {
        console.error('❌ Error creando curso:', error);
        res.status(500).json({ fatal: error.message });
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
