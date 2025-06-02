/**
 * Divide un texto largo en chunks de tamaño aproximado maxChunkSize (en caracteres).
 * Corta por párrafo (\n\n) o punto final si es posible.
 */

const splitTextIntoChunks = (text, maxChunkSize = 1500) => {
    const chunks = [];
    let current = '';

    const paragraphs = text.split(/\n\s*\n/); // separa por párrafos dobles

    for (const paragraph of paragraphs) {
        if ((current + paragraph).length > maxChunkSize) {
            if (current) chunks.push(current.trim());
            current = paragraph;
        } else {
            current += '\n\n' + paragraph;
        }
    }

    if (current) chunks.push(current.trim());

    return chunks;
};

module.exports = {
    splitTextIntoChunks
};
