const express = require('express');
const router = express.Router();

const ErrorHandler = new(require('../services/error-handling.service').ErrorHandler)();
const BusinessService = new(require('../services/business.service').BusinessService)();

const { loginValidation } = require('../validation/validation');

router.post('/login', (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': error.details[0].message }, res);

    BusinessService.getBusiness({ email: req.body.email }).then(async(business) => {
        if (business) {
            const validPassword = await bcrypt.compare(req.body.password, business.password);
            if (!validPassword) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': 'The email or phone or password is wrong' }, res);

            const token = jwt.sign({ _id: business._id, dt: new Date() }, JWT_SECRET);
            res.status(200).header('x-auth-token', token).send({
                'token': token
            });
        } else {
            return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': 'There is not an account with the provided email address' }, res);
        }
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    });
});

module.exports = router;