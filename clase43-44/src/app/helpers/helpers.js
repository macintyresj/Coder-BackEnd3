const bcrypt = require('bcrypt');

// función para obtener num random
const obtenerRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

// validar password de un usuario
const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

// hashear pass de usuario
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = {
    obtenerRandom,
    isValidPassword,
    createHash
};