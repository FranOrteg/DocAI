const openai = require('../config/openai');

/**
 * Crea un nuevo Assistant y lo asocia al vector store
 */
const createAssistantForCourse = async (vectorStoreId, courseName = 'Curso sin nombre') => {
    const assistant = await openai.beta.assistants.create({
        name: `Asistente ${courseName}`,
        // instructions: `Eres un asistente que ayuda a preparar clases. Usa los documentos del curso "${courseName}" para responder.`,        

        instructions: "Responde como si fueses un instructor",
        model: 'gpt-4-turbo',
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
const createVectorStore = async (courseName = 'Curso sin nombre') => {
    const vectorStore = await openai.beta.vectorStores.create({
        name: `Documentos de ${courseName}`
    });
    return vectorStore.id;
};

/**
 * Inicia una conversación y envía un mensaje al assistant
 */
const sendMessageToAssistant = async ({ assistantId, threadId = null, message }) => {
    let finalThreadId = threadId;

    if (!finalThreadId) {
        const thread = await openai.beta.threads.create();
        finalThreadId = thread.id;
        console.log('🧵 Thread creado:', finalThreadId);
    }

    // Enviamos el mensaje del usuario
    await openai.beta.threads.messages.create(finalThreadId, {
        role: 'user',
        content: message
    });
    console.log('📨 Mensaje enviado al thread:', message);


    // Creamos el run
    const run = await openai.beta.threads.runs.create(finalThreadId, {
        assistant_id: assistantId
    });
    console.log('🏃 Run iniciado:', run.id);

    // Esperamos a que termine
    let runStatus;

    while (true) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(finalThreadId, run.id);
        console.log(`⏳ Run status: ${runStatus.status}`);

        if (runStatus.status === 'completed') break;

        if (runStatus.status === 'failed') {
            console.error('❌ Run falló con error:', runStatus.last_error);
            throw new Error(runStatus.last_error?.message || 'El run falló sin mensaje de error.');
        }
    }

    // Obtenemos el mensaje del asistente
    const messages = await openai.beta.threads.messages.list(finalThreadId);
    console.log('📥 Mensajes en el thread:', JSON.stringify(messages.data, null, 2));

    const lastMessage = messages.data.find(msg => msg.role === 'assistant');

    return {
        respuesta: lastMessage?.content?.[0]?.text?.value || '❗ El assistant no respondió.',
        threadId: finalThreadId
    };
};

module.exports = {
    createAssistantForCourse,
    createVectorStore,
    sendMessageToAssistant
};
