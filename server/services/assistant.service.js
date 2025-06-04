const openai = require('../config/openai');

/**
 * Crea un nuevo Assistant y lo asocia al vector store
 */
const createAssistantForCourse = async (vectorStoreId, courseName = 'Curso sin nombre') => {
    const assistant = await openai.beta.assistants.create({
        name: `Asistente para ${courseName}`,
        instructions: `Eres un asistente que ayuda a preparar clases. Usa los documentos del curso ${courseName} para responder.`,
        model: 'gpt-4-turbo-preview',
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

/**
 * Crea un nuevo vector store
 */
const createVectorStore = async () => {
    const vectorStore = await openai.vectorStores.create({
        name: 'Documentos del curso'
    });
    return vectorStore.id;
};

/**
 * Inicia una conversación y envía un mensaje al assistant
 */
const sendMessageToAssistant = async ({ assistantId, message }) => {
    const run = await openai.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        }
    });

    // Esperar a que termine el run
    let runStatus;
    do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.threads.runs.retrieve(run.id);
    } while (runStatus.status !== 'completed');

    const messages = await openai.threads.messages.list(run.thread_id);
    const lastMessage = messages.data.find(msg => msg.role === 'assistant');

    return lastMessage?.content[0]?.text?.value || 'No se obtuvo respuesta del asistente.';
};

module.exports = {
    createAssistantForCourse,
    createVectorStore,
    sendMessageToAssistant
};
