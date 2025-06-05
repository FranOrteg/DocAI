const router = require('express').Router();
const path = require('path');
const fs = require('fs');

const { checkToken } = require('../../helpers/middlewares');
const openai = require('../../config/openai');
const {
    createAssistantForCourse,
    createVectorStore
} = require('../../services/assistant.service');
const {
    createCourse,
    getCoursesByUserId,
    getCourseById,
    deleteCourseById
} = require('../../models/courses.model');
const {
    deleteAllDocumentsByCourse,
    getDocumentsByCourse
} = require('../../models/document.model');


// Crear curso
router.post('/', checkToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        const user_id = req.user.id;

        // 🧠 1. Crear vector store y assistant
        const vectorStoreId = await createVectorStore(name);
        const assistantId = await createAssistantForCourse(vectorStoreId, name);

        // 🧠 2. Crear curso con IDs asociados
        const [result] = await createCourse({
            user_id,
            name,
            description,
            assistant_id: assistantId,
            vector_store_id: vectorStoreId
        });
        
        const courseId = result.insertId;

        // 🔁 3. Obtener curso recién creado
        const [rows] = await getCourseById(courseId);
        const createdCourse = rows[0];

        res.json(createdCourse);
        // res.json({ success: 'Curso creado', courseId: result.insertId, assistantId, vectorStoreId });
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

// Borrar el curso y el assistente de la plataforma ademas de los documentos y la BD
// DELETE /api/courses/:id
router.delete('/:id', checkToken, async (req, res) => {
    const courseId = req.params.id;

    try {
        const [courseRows] = await getCourseById(courseId);
        if (courseRows.length === 0) return res.status(404).json({ fatal: 'Curso no encontrado' });

        const course = courseRows[0];

        // 1. Borrar assistant de OpenAI
        if (course.assistant_id) {
            try {
                await openai.beta.assistants.del(course.assistant_id);
            } catch (err) {
                console.warn(`⚠️ No se pudo eliminar el assistant: ${err.message}`);
            }
        }

        // 2. Borrar vector store
        if (course.vector_store_id) {
            try {
                await openai.beta.vectorStores.del(course.vector_store_id);
            } catch (err) {
                console.warn(`⚠️ No se pudo eliminar el vector store: ${err.message}`);
            }
        }

        // 3. Borrar documentos relacionados
        const [docs] = await getDocumentsByCourse(courseId);
        for (const doc of docs) {
            if (doc.openai_file_id) {
                try {
                    await openai.files.del(doc.openai_file_id);
                } catch (err) {
                    console.warn(`⚠️ No se pudo eliminar archivo de OpenAI: ${err.message}`);
                }
            }
            const filePath = path.join(__dirname, '../../uploads', doc.filepath);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await deleteAllDocumentsByCourse(courseId); // 👈 función nueva en el modelo

        // 4. Borrar el curso
        await deleteCourseById(courseId); // 👈 función nueva en el modelo

        res.json({ success: true });
    } catch (err) {
        console.error('❌ Error al borrar curso:', err);
        res.status(500).json({ fatal: 'Error interno al borrar curso' });
    }
});

// Listar los cursos del usuario
router.get('/my', checkToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [courses] = await getCoursesByUserId(userId);
        res.json(courses);
    } catch (err) {
        console.error('❌ Error al obtener cursos del usuario:', err);
        res.status(500).json({ fatal: 'Error interno al obtener cursos' });
    }
});



module.exports = router;
