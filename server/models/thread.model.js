
const createThreadEntry = ({ user_id, course_id, assistant_thread_id, topic }) => {
    return db.query(
        'INSERT INTO threads (user_id, course_id, assistant_thread_id, topic) VALUES (?, ?, ?, ?)',
        [user_id, course_id, assistant_thread_id, topic || null]
    );
};

const getThreadByUserAndCourse = (user_id, course_id) => {
    return db.query(
        'SELECT * FROM threads WHERE user_id = ? AND course_id = ? LIMIT 1',
        [user_id, course_id]
    );
};

const getAllThreadsByUserAndCourse = (user_id, course_id) => {
    return db.query(
      'SELECT id, assistant_thread_id, topic, created_at FROM threads WHERE user_id = ? AND course_id = ? ORDER BY created_at DESC',
      [user_id, course_id]
    );
  };
  

module.exports = {
    createThreadEntry,
    getThreadByUserAndCourse,
    getAllThreadsByUserAndCourse
};
