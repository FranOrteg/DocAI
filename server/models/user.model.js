//Busco usuario por email
const getByEmail = (email) => {
    return db.query('SELECT * FROM users WHERE email = ?',
        [email]
    );
}

// Busco usuario por id
const getById = (userId) => {
    return db.query('SELECT * FROM users where id = ?', [userId])
};


module.exports = {
    getByEmail,
    getById
}