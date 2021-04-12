const express = require('express');
const adminAuthenticate = require('../middlewares/adminAuthenticate');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { JWT_SECRET } = require('../global');

const { loginValidation } = require('../validation/validation');

const ErrorHandler = new (require('../services/error-handling.service').ErrorHandler)();
const AdminService = new (require('../services/admin.service').AdminService)();

router.post('/login', (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': error.details[0].message }, res);

    AdminService.getAdmin({ email: req.body.email }).then(async (admin) => {
        if (admin) {
            const validPassword = await bcrypt.compare(req.body.password, admin.password);
            if (!validPassword) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': 'The email or phone or password is wrong' }, res);

            const token = jwt.sign({ _id: admin._id, dt: new Date() }, JWT_SECRET);
            res.status(200).header('x-auth-token', token).send({
                'token': token
            });
        } else {
            return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': 'The email or phone or password is wrong' }, res);
        }
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    });
})

router.post('/check-token', adminAuthenticate, (req, res) => {
    const token = req.header("x-auth-token");
    if (token) {
        try {
            const verified = jwt.verify(token, JWT_SECRET);
            if (verified) {
                try {
                    AdminService.getAdmin({ _id: verified._id }).then((admin) => {
                        res.status(200).send({
                            'valid': (admin != null && new Date(verified.dt).getTime() > admin.lastPasswordReset.getTime())
                        })
                    }).catch((err) => {
                        return ErrorHandler.returnError(err, res);
                    });
                } catch (err) {
                    return ErrorHandler.returnError({ 'errorCode': 500 }, res);
                }
            } else {
                res.status(200).send({
                    'valid': false
                })
            }
        } catch (err) {
            res.status(200).send({
                'valid': false
            })
        }
    } else {
        res.status(200).send({
            'valid': false
        })
    }
})

router.get('/pending-businesses', adminAuthenticate, (req, res) => {
    AdminService.getPendingBusinesses().then((pendingBusinesses) => {
        res.status(200).send({
            pendingBusinesses: pendingBusinesses
        })
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    })
})

router.put('/approve-business/:id', adminAuthenticate, (req, res) => {
    if(mongoose.Types.ObjectId.isValid(req.params.id)) {
        AdminService.approveBusiness(req.params.id).then((updatedBusiness) => {
            res.status(200).send({
                updatedBusiness: updatedBusiness
            })
        }).catch((err) => {
            return ErrorHandler.returnError(err, res);
        })
    } else {
        return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': 'Invalid business id'}, res);
    }
})

module.exports = router;