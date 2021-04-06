const express = require('express');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

const ErrorHandler = new(require('../services/error-handling.service').ErrorHandler)();
const SubscriptionService = new(require('../services/subscription.service').SubscriptionService)();

router.get('/active-subscription', authenticate, (req, res) => {
    SubscriptionService.getActiveSubscription({businessId: req.business._id}).then((activeSubscription) => {
        res.status(200).send({
            activeSubscription: activeSubscription
        })
    }).catch((err) => {
        return ErrorHandler.handleError(err, res);
    })
})

module.exports = router;