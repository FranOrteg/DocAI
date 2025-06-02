const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const readTextFromFile = async (filepath) => {
    const ext = path.extname(filepath).toLowerCase();

    if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filepath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    }

    if (ext === '.docx') {
        const data = await mammoth.extractRawText({ path: filepath });
        return data.value;
    }

    if (ext === '.txt') {
        return fs.readFileSync(filepath, 'utf-8');
    }

    throw new Error('Formato de archivo no soportado: ' + ext);
};

module.exports = {
    readTextFromFile
};
