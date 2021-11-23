const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, max: 100, unique: true },
    password: { type: String, required: true, max: 100 }
});

const User = model('users', userSchema);

module.exports = User;