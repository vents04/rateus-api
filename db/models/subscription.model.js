const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    subscriptionId: {
        type: String,
        required: true
    },
    dt: {
        type: Date,
        default: Date.now
    },
    from: {
        type: String,
        required: true
    }
})

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = {Subscription}