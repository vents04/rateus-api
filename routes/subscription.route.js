const express = require('express');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

const ErrorHandler = new(require('../services/error-handling.service').ErrorHandler)();
const SubscriptionService = new(require('../services/subscription.service').SubscriptionService)();

const { subscriptionValidation } = require('../validation/validation');

const { PLAN_IDS } = require('../global');

router.get('/active-subscription', authenticate, (req, res) => {
    SubscriptionService.getActiveSubscription({businessId: req.business._id}).then((response) => {
        res.status(200).send(response)
    }).catch((err) => {
        return ErrorHandler.handleError(err, res);
    })
})

router.post('/', authenticate, (req, res) => {
    const { error } = subscriptionValidation(req.body);
    if (error) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': error.details[0].message }, res);

    if(PLAN_IDS.includes(req.body.planId)) {
        SubscriptionService.createSubscription(req.body.planId, req.business._id).then((subscription) => {
            res.status(200).send({
                subscription: subscription
            })
        }).catch((err) => {
            return ErrorHandler.returnError(err, res);
        })
    } else {
        return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': 'Invalid plan id'}, res);
    }
})

module.exports = router;