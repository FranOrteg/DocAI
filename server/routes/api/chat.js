const router = require('express').Router();
const { checkToken } = require('../../helpers/middlewares');
const { getCourseById } = require('../../models/courses.model');
const { getThreadByUserAndCourse, createThreadEntry, getAllThreadsByUserAndCourse } = require('../../models/thread.model');
const { saveMessage, getMessagesByThread } = require('../../models/message.model');
const { sendMessageToAssistant } = require('../../services/assistant.service');
const { deleteThread, getThreadById } = require('../../models/thread.model');
const { deleteMessagesByThreadId } = require('../../models/message.model'); 

// POST /api/chat/:courseId
router.post('/:courseId', checkToken, async (req, res) => {
  try {
    const { message, threadId: providedThreadId, forceNewThread } = req.body;
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

    let usedThreadId = providedThreadId;

    // Si no se proporciona un threadId Y no se fuerza uno nuevo, buscar uno existente
    if (!usedThreadId && !forceNewThread) {
      const [threadResult] = await getThreadByUserAndCourse(user_id, course_id);
      if (threadResult.length > 0) {
        usedThreadId = threadResult[0].assistant_thread_id;
      }
    }

    const { respuesta, threadId: newThreadId } = await sendMessageToAssistant({
      assistantId,
      threadId: usedThreadId,
      message
    });

    // Si no existía un thread, lo registramos ahora
    if (!usedThreadId) {
      await createThreadEntry({
        user_id,
        course_id,
        assistant_thread_id: newThreadId
      });
      usedThreadId = newThreadId;
    }

    // Guardamos mensajes
    await saveMessage({ thread_id: usedThreadId, user_id, course_id, role: 'user', content: message });
    await saveMessage({ thread_id: usedThreadId, user_id, course_id, role: 'assistant', content: respuesta });

    res.json({ respuesta, threadId: usedThreadId }); 
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


// DELETE /api/chat/thread/:threadId
router.delete('/thread/:threadId', checkToken, async (req, res) => {
  try {
    const thread_id = req.params.threadId;
    const user_id = req.user.id;

    // 1. Obtener el thread para verificar propiedad
    const [threadRows] = await getThreadById(thread_id);

    if (!threadRows.length) {
      return res.status(404).json({ fatal: 'Conversación no encontrada' });
    }

    const thread = threadRows[0];

    if (thread.user_id !== user_id) {
      return res.status(403).json({ fatal: 'No tienes permiso para borrar esta conversación' });
    }

    // 2. Borrar mensajes (opcional)
    if (typeof deleteMessagesByThreadId === 'function') {
      await deleteMessagesByThreadId(thread_id);
    }

    // 3. Borrar thread
    await deleteThread(thread_id);
    res.json({ success: true, message: 'Conversación eliminada correctamente' });

  } catch (error) {
    console.error('❌ Error en DELETE /chat/thread/:threadId:', error);
    res.status(500).json({ fatal: error.message });
  }
});




module.exports = router;
