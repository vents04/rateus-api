const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionnaireId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    dt: {
        type: Date,
        default: Date.now
    },
    answers: [
        {
            answer: {
                type: String,
                optional: true
            },
            input: {
                type: Number,
                required: true
            }
        }]
})

const Answer = mongoose.model("Answer", answerSchema);
module.exports = { Answer }