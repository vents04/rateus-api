const mongoose = require('mongoose');

const questionnaireSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    businessId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    questions: {
        type: Array,
        "default": [{
            title: "Rate your overall experience.",
            input: 0
        }]
    }
})

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);
module.exports = { Questionnaire }