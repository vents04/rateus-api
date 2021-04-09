const express = require('express');
const router = express.Router();

const ErrorHandler = new (require('../services/error-handling.service').ErrorHandler)();
const WaitlistService = new (require('../services/waitlist.service').WaitlistService)();

const { createWaitlistValidation } = require('../validation/validation');

router.post('/', (req, res) => {
    const { error } = createWaitlistValidation(req.body);
    if (error) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': error.details[0].message }, res);

    WaitlistService.createWaitlist(req.body).then((waitlist) => {
        res.status(200).send({
            waitlist: waitlist
        })
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    });
});

module.exports = router;