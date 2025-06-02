
const saveMessage = ({ thread_id, user_id, course_id, role, content }) => {
    return db.query(
        'INSERT INTO messages (thread_id, user_id, course_id, role, content) VALUES (?, ?, ?, ?, ?)',
        [thread_id, user_id, course_id, role, content]
    );
};

const getMessagesByThread = (thread_id) => {
    return db.query(
        'SELECT * FROM messages WHERE thread_id = ? ORDER BY created_at ASC',
        [thread_id]
    );
};

module.exports = {
    saveMessage,
    getMessagesByThread
};
