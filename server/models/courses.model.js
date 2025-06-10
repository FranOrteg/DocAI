
// Crear curso
const createCourse = ({ user_id, name, description, assistant_id, vector_store_id }) => {
    return db.query(
        'INSERT INTO courses (user_id, name, description, assistant_id, vector_store_id) VALUES (?, ?, ?, ?, ?)',
        [user_id, name, description, assistant_id, vector_store_id]
    );
};

// Obtener Curso por ID
const getCoursesByUserId = (userId) => {
    return db.query('SELECT * FROM courses WHERE user_id = ?', [userId]);
};

// Obtener el curso por ID
const getCourseById = (id) => {
    return db.query('SELECT * FROM courses WHERE id = ?', [id]);
};

// Actualizar el curso
const setAssistantId = (course_id, assistant_id) => {
    return db.query('UPDATE courses SET assistant_id = ? WHERE id = ?', [assistant_id, course_id]);
};

// Recuperar Assistant ID
const getAssistantId = (course_id) => {
    return db.query('SELECT assistant_id FROM courses WHERE id = ?', [course_id]);
};

// Establecer vector_store_id
const setVectorStoreId = (course_id, vector_store_id) => {
    return db.query(
        'UPDATE courses SET vector_store_id = ? WHERE id = ?',
        [vector_store_id, course_id]
    );
};

// Eliminar curso por ID
const deleteCourseById = (id) => {
    return db.query('DELETE FROM courses WHERE id = ?', [id]);
};

const updateCourse = (id, { name, description }) => {
    return db.query(
        'UPDATE courses SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
    );
};


module.exports = {
    createCourse,
    getCoursesByUserId,
    setAssistantId,
    getAssistantId,
    getCourseById,
    setVectorStoreId,
    deleteCourseById,
    updateCourse
};
