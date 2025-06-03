const openai = require('../config/openai');

/**
 * Crea un nuevo Assistant y lo asocia al vector store
 */
const createAssistantForCourse = async (vectorStoreId, courseName = 'Curso sin nombre') => {
    const assistant = await openai.beta.assistants.create({
        name: `Asistente para ${courseName}`,
        instructions: `Eres un asistente que ayuda a preparar clases. Usa los documentos del curso ${courseName} para responder.`,
        model: 'gpt-4',
        tools: [{ type: 'file_search' }],
        tool_resources: {
            file_search: {
                vector_store_ids: [vectorStoreId]
            }
        }
    });

    console.log('🤖 Assistant creado:', assistant.id);
    return assistant.id;
};

const createVectorStore = async () => {
    const vectorStore = await openai.beta.vectorStores.create({
      name: 'Documentos del curso'
    });
    return vectorStore.id;
  };

/**
 * Inicia un nuevo thread de conversación
 */
const createThread = async () => {
    const thread = await openai.beta.threads.create();
    return thread.id;
};

/**
 * Envía un mensaje y recupera respuesta
 */
const sendMessageToAssistant = async ({ assistantId, threadId, message }) => {
    await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message
    });

    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId
    });

    // Esperar a que termine el "run"
    let runStatus;
    do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    } while (runStatus.status !== 'completed');

    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data.find(msg => msg.role === 'assistant');

    return lastMessage?.content[0]?.text?.value || 'No se obtuvo respuesta del asistente.';
};

module.exports = {
    createAssistantForCourse,
    createThread,
    sendMessageToAssistant,
    createVectorStore
};
