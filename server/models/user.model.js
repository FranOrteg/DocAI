
//Crear usuario 
const createUser = ({ name, email, password, role}) => {
    return db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name,email, password, role]
    );
}

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
    getById,
    createUser
}