// Guardar documento
const saveDocument = ({ user_id, course_id, filename, filepath, type, status = 'pending' }) => {
    return db.query(
        'INSERT INTO documents (user_id, course_id, filename, filepath, type, status) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, course_id, filename, filepath, type, status]
    );
};

// Obtener Documento por Curso 
const getDocumentsByCourse = (course_id) => {
    return db.query(
        'SELECT * FROM documents WHERE course_id = ?',
        [course_id]
    );
};

// Actualizar el estado del documento
const updateDocumentStatus = (docId, status) => {
  return db.query('UPDATE documents SET status = ? WHERE id = ?', [status, docId]);
};


module.exports = {
    saveDocument,
    getDocumentsByCourse,
    updateDocumentStatus
};
