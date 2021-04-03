const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    answer: {
      type: String,
      required: true,
    },
    input: {
      type: Nsumber,
      required: true,
    }
})

const Answer = mongoose.model("Answer", answerSchema);
module.exports = {Answer}