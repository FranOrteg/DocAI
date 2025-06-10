
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

// Obtengo todos los usuarios
const getAllUsers = () => {
    return db.query('SELECT id, name, email, role FROM users');
};

// Borro un usuario por ID
const deleteUserById = (id) => {
    return db.query('DELETE FROM users WHERE id = ?', [id]);
};

const updateUser = (id, { name, email, role, password }) => {
    // Si no se proporciona una nueva contraseña, no la actualizamos
    if (password) {
        return db.query(
            'UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?',
            [name, email, role, password, id]
        );
    } else {
        return db.query(
            'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
            [name, email, role, id]
        );
    }
};


module.exports = {
    getByEmail,
    getById,
    createUser,
    getAllUsers,
    deleteUserById,
    updateUser
}