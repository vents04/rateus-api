const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        default: '',
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
    },
    color: {
        type: String,
        default: "#90d977"
    },
    accountCreation: {
        type: Date,
        default: Date.now
    },
    lastPasswordReset: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 0
    }
})

const Business = mongoose.model("Business", businessSchema);
module.exports = { Business }