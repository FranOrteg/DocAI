
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

module.exports = {
    createCourse,
    getCoursesByUserId
};
