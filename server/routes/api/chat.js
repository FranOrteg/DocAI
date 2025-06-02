const router = require('express').Router();
const { checkToken } = require('../../helpers/middlewares');
const { getThreadByUserAndCourse, createThreadEntry } = require('../../models/thread.model');
const { sendMessageToAssistant, createThread } = require('../../services/assistant.service');

// POST /api/chat/:courseId
router.post('/:courseId', checkToken, async (req, res) => {
    try {
        const { message } = req.body;
        const course_id = req.params.courseId;
        const user_id = req.user.id;

        if (!message) return res.status(400).json({ fatal: 'Mensaje vacío' });

        // Ver si ya hay un thread creado
        const [existing] = await getThreadByUserAndCourse(user_id, course_id);

        let threadId;
        if (existing.length > 0) {
            threadId = existing[0].assistant_thread_id;
        } else {
            // Crear nuevo thread y guardar en BD
            threadId = await createThread();
            await createThreadEntry({ user_id, course_id, assistant_thread_id: threadId });
        }

        // Aquí necesitarás recuperar también el assistantId asociado al curso
        // Puedes guardarlo en la tabla courses o tenerlo de forma centralizada
        const assistantId = '[AQUÍ_TU_ASSISTANT_ID]'; // temporal

        const respuesta = await sendMessageToAssistant({ assistantId, threadId, message });

        res.json({ respuesta });

    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
});

module.exports = router;
