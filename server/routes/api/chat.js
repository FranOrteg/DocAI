const router = require('express').Router();

const { checkToken } = require('../../helpers/middlewares');
const { getThreadByUserAndCourse, createThreadEntry } = require('../../models/thread.model');
const { getCourseById } = require('../../models/courses.model');
const { createThread, sendMessageToAssistant } = require('../../services/assistant.service');
const { saveMessage } = require('../../models/message.model');
const { getMessagesByThread } = require('../../models/message.model');

// POST /api/chat/:courseId
router.post('/:courseId', checkToken, async (req, res) => {
    try {
        const { message } = req.body;
        const course_id = req.params.courseId;
        const user_id = req.user.id;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ fatal: 'Mensaje vacío' });
        }

        // Obtener assistant_id del curso
        const [courseResult] = await getCourseById(course_id);
        const course = courseResult[0];

        if (!course || !course.assistant_id) {
            return res.status(400).json({ fatal: 'El curso no tiene assistant asociado' });
        }

        const assistantId = course.assistant_id;

        // Ver si ya existe un thread para este usuario y curso
        const [threadResult] = await getThreadByUserAndCourse(user_id, course_id);

        let threadId;

        if (threadResult.length > 0) {
            threadId = threadResult[0].assistant_thread_id;
        } else {
            threadId = await createThread();
            await createThreadEntry({ user_id, course_id, assistant_thread_id: threadId });
        }

        // Enviar mensaje al assistant
        const respuesta = await sendMessageToAssistant({ assistantId, threadId, message });

        res.json({ respuesta });

        // Guardar ambos mensajes
        await saveMessage({ thread_id: threadId, user_id, course_id, role: 'user', content: message });
        await saveMessage({ thread_id: threadId, user_id, course_id, role: 'assistant', content: respuesta });

    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
});

// Ruta para recuperar el historial del curso
router.get('/:courseId/history', checkToken, async (req, res) => {
    try {
        const course_id = req.params.courseId;
        const user_id = req.user.id;

        // Buscar thread local
        const [threadResult] = await getThreadByUserAndCourse(user_id, course_id);
        if (threadResult.length === 0) {
            return res.status(404).json({ fatal: 'No existe conversación para este curso' });
        }

        const thread_id = threadResult[0].id;
        const [messages] = await getMessagesByThread(thread_id);

        res.json(messages);

    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
});


module.exports = router;
