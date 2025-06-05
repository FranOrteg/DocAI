const router = require('express').Router();
const { checkToken } = require('../../helpers/middlewares');
const { getCourseById } = require('../../models/courses.model');
const { getThreadByUserAndCourse, createThreadEntry, getAllThreadsByUserAndCourse } = require('../../models/thread.model');
const { saveMessage, getMessagesByThread } = require('../../models/message.model');
const { sendMessageToAssistant } = require('../../services/assistant.service');

// POST /api/chat/:courseId
router.post('/:courseId', checkToken, async (req, res) => {
  try {
    const { message } = req.body;
    const course_id = req.params.courseId;
    const user_id = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ fatal: 'Mensaje vacío' });
    }

    const [courseRows] = await getCourseById(course_id);
    const course = courseRows[0];

    if (!course || !course.assistant_id) {
      return res.status(400).json({ fatal: 'El curso no tiene assistant asociado' });
    }

    const assistantId = course.assistant_id;

    // Buscar o crear thread
    const [threadResult] = await getThreadByUserAndCourse(user_id, course_id);
    let threadId = threadResult.length > 0 ? threadResult[0].assistant_thread_id : null;

    const { respuesta, threadId: usedThreadId } = await sendMessageToAssistant({
      assistantId,
      threadId,
      message
    });

    if (!threadId) {
      await createThreadEntry({ user_id, course_id, assistant_thread_id: usedThreadId });
      threadId = usedThreadId;
    }

    await saveMessage({ thread_id: threadId, user_id, course_id, role: 'user', content: message });
    await saveMessage({ thread_id: threadId, user_id, course_id, role: 'assistant', content: respuesta });

    res.json({ respuesta });
  } catch (error) {
    console.error('❌ Error en POST /chat/:courseId:', error);
    res.status(500).json({ fatal: error.message });
  }
});

// GET /api/chat/:courseId/history
router.get('/:courseId/history', checkToken, async (req, res) => {
  try {
    const course_id = req.params.courseId;
    const user_id = req.user.id;

    const [threadResult] = await getThreadByUserAndCourse(user_id, course_id);
    if (threadResult.length === 0) {
      return res.status(404).json({ fatal: 'No existe conversación para este curso' });
    }

    const thread_id = threadResult[0].id;
    const [messages] = await getMessagesByThread(thread_id);

    res.json(messages);
  } catch (error) {
    console.error('❌ Error en GET /chat/:courseId/history:', error);
    res.status(500).json({ fatal: error.message });
  }
});

// GET /api/chat/:courseId/threads
router.get('/:courseId/threads', checkToken, async (req, res) => {
  try {
    const course_id = req.params.courseId;
    const user_id = req.user.id;

    const [threads] = await getAllThreadsByUserAndCourse(user_id, course_id);
    res.json(threads);
  } catch (error) {
    console.error('❌ Error en GET /chat/:courseId/threads:', error);
    res.status(500).json({ fatal: error.message });
  }
});

// GET /api/chat/thread/:threadId/history
router.get('/thread/:threadId/history', checkToken, async (req, res) => {
  try {
    const thread_id = req.params.threadId;

    const [messages] = await getMessagesByThread(thread_id);

    if (!messages.length) {
      return res.status(404).json({ fatal: 'No hay mensajes para este thread' });
    }

    res.json(messages);
  } catch (error) {
    console.error('❌ Error en GET /chat/thread/:threadId/history:', error);
    res.status(500).json({ fatal: error.message });
  }
});



module.exports = router;
