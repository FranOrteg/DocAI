
// Crear curso
const createCourse = ({ user_id, name, description }) => {
    return db.query(
        'INSERT INTO courses (user_id, name, description) VALUES (?, ?, ?)',
        [user_id, name, description]
    );
};

// Obtener Curso por ID
const getCoursesByUserId = (userId) => {
    return db.query('SELECT * FROM courses WHERE user_id = ?', [userId]);
};

// Establecer Assistant ID
const setAssistantId = (course_id, assistant_id) => {
    return db.query('UPDATE courses SET assistant_id = ? WHERE id = ?', [assistant_id, course_id]);
};

// Recuperar Assistant ID
const getAssistantId = (course_id) => {
    return db.query('SELECT assistant_id FROM courses WHERE id = ?', [course_id]);
};

module.exports = {
    createCourse,
    getCoursesByUserId,
    setAssistantId,
    getAssistantId
};
