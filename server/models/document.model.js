// Guardar documento
const saveDocument = ({ user_id, course_id, filename, filepath, type, status = 'pending', openai_file_id }) => {
    return db.query(
        'INSERT INTO documents (user_id, course_id, filename, filepath, type, status, openai_file_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_id, course_id, filename, filepath, type, status], openai_file_id
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

// Obtener documento por ID
const getDocumentById = (id) => {
  return db.query('SELECT * FROM documents WHERE id = ?', [id]);
};

// Borrar documento por ID
const deleteDocumentById = (id) => {
  return db.query('DELETE FROM documents WHERE id = ?', [id]);
};


module.exports = {
    saveDocument,
    getDocumentsByCourse,
    updateDocumentStatus,
    deleteDocumentById,
    getDocumentById
};
