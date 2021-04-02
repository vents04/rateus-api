const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    uId: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    emailOrPhone:{
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
    },
    color:{
        type: String,
        required: true
    },
    accountCreation:{
        type: Date,
        default: Date.now
    }
})

const Business = mongoose.model("Business", businessSchema);
module.exports = {Business}