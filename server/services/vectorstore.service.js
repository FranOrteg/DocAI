const fs = require('fs');
const path = require('path');
const os = require('os');
const openai = require('../config/openai');

/**
 * Recibe un array de chunks y los sube al vector store de OpenAI
 */
const uploadChunksToVectorStore = async (chunks, courseName = 'default-course') => {
    // Paso 1: Crear archivo temporal
    const filePath = path.join(os.tmpdir(), `vector-chunks-${Date.now()}.txt`);
    const stream = fs.createWriteStream(filePath);

    chunks.forEach((chunk, i) => {
        stream.write(`## ${courseName} - chunk ${i + 1}\n${chunk}\n\n`);
    });

    stream.end();

    // Esperar a que termine de escribir
    await new Promise((resolve) => stream.on('finish', resolve));

    // Paso 2: Subir archivo a OpenAI
    const file = await openai.files.create({
        file: fs.createReadStream(filePath),
        purpose: 'assistants'
    });

    // Paso 3: Adjuntar a vector store
    const vectorStore = await openai.vectorStores.create({
        name: `VectorStore ${courseName}`,
        file_ids: [file.id]
    });

    console.log('📤 Archivo cargado:', file.id);
    console.log('🧠 Vector Store creado:', vectorStore.id);

    // Limpieza temporal (opcional)
    fs.unlinkSync(filePath);

    return {
        fileId: file.id,
        vectorStoreId: vectorStore.id
    };
};

module.exports = {
    uploadChunksToVectorStore
};
