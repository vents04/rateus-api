const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  emailOrPhone: {
    type: String,
    required: true,
  }
})

const Waitlist = mongoose.model("Waitlist", waitlistSchema);
module.exports = { Waitlist }