const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true

    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        enum: ['admin', 'user'],//solo permite estos valores
        default: 'user'//por defecto es tipo user
    }
});

module.exports = mongoose.model('User', userSchema );