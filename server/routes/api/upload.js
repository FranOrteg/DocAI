const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { checkToken } = require('../../helpers/middlewares');
const { saveDocument } = require('../../models/document.model');
const { readTextFromFile } = require('../../helpers/fileReader');
const { splitTextIntoChunks } = require('../../helpers/textProcessor');
const { uploadChunksToVectorStore } = require('../../services/vectorstore.service');
const { createAssistantForCourse } = require('../../services/assistant.service');
const { getCourseById, setAssistantId } = require('../../models/courses.model'); 


// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const uniqueName = `${timestamp}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Ruta para subir archivo asociado a un curso
router.post('/:courseId', checkToken, upload.single('document'), async (req, res) => {
    try {
        const file = req.file;
        const course_id = req.params.courseId;
        const user_id = req.user.id;

        if (!file) return res.status(400).json({ fatal: 'No se ha subido ningún archivo' });

        // Guardar documento en BD
        const docData = {
            user_id,
            course_id,
            filename: file.originalname,
            filepath: file.filename,
            type: file.mimetype
        };

        const [result] = await saveDocument(docData);

        // Leer archivo y trocear
        const fullPath = path.join(__dirname, '../../uploads', file.filename);
        const text = await readTextFromFile(fullPath);
        const chunks = splitTextIntoChunks(text, 1500);

        // Obtener curso y assistant_id actual
        const [courseResult] = await getCourseById(course_id);
        const course = courseResult[0];

        let assistantId = course?.assistant_id;

        // Si no existe, crear assistant y actualizar curso
        if (!assistantId) {
            const vectorStoreInfo = await uploadChunksToVectorStore(chunks, course.name || 'Curso');
            assistantId = await createAssistantForCourse(vectorStoreInfo.vectorStoreId, course.name || 'Curso');
            await setAssistantId(course_id, assistantId);
        }

        console.log('🧠 Assistant activo:', assistantId);
        res.json({ success: 'Archivo subido y vector store actualizado', docId: result.insertId });

    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
});



module.exports = router;
