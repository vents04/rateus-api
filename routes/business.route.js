const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Business } = require('../db/models/business.model');

const ErrorHandler = new(require('../services/error-handling.service').ErrorHandler)();
const BusinessService = new(require('../services/business.service').BusinessService)();
const QuestionnaireService = new(require('../services/questionnaire.service').QuestionnaireService)();
const AnswerService = new(require('../services/answer.service').AnswerService)();

const { JWT_SECRET } = require('../global');

const { loginValidation, signupValidation } = require('../validation/validation');

const authenticate = require('../middlewares/authenticate');

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

router.post('/check-token', (req, res) => {
    const token = req.header("x-auth-token");
    if (token) {
        try {
            const verified = jwt.verify(token, JWT_SECRET);
            if (verified) {
                try {
                    BusinessService.getBusiness({ _id: verified._id }).then((business) => {
                        res.status(200).send({
                            'valid': (business != null && new Date(verified.dt).getTime() > business.lastPasswordReset.getTime())
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
});

router.get('/', authenticate, (req, res) => {
    BusinessService.getBusiness({_id: req.business._id}).then((business) => {
        delete business.lastPasswordReset; delete business.accountCreation; delete business.__v; delete business.uId;
        res.status(200).send({
            business: business
        })
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    })
})

router.get('/dashboard', authenticate, (req, res) => {
    QuestionnaireService.getQuestionnaires({ businessId: req.business._id}).then(async (questionnaires) => {
        let totalAnswers = 0, lastWeekAnswers = 0, tempAnswers = 0;
        let questionnairesResult = [];
        for (let index = 0; index < questionnaires.length; index++) {
            await new Promise((resolve, reject) => { 
                AnswerService.getAnswers({ questionnaireId: questionnaires[index]._id }).then((answers) => {
                    tempAnswers += answers.length;
                    for (let j = 0; j < answers.length; j++) {
                        if(new Date(answers[j].dt).getTime() + 604800000 >= new Date().getTime()) {
                            lastWeekAnswers++;
                        }   
                    }
                    resolve();
                });
            })

            questionnairesResult.push({ title: questionnaires[index].title, responses: tempAnswers, _id: questionnaires[index]._id });
            totalAnswers += tempAnswers;
            tempAnswers = 0;
        }

        res.status(200).send({
            totalResponses: totalAnswers,
            lastWeekResponses: lastWeekAnswers,
            questionnairesCount: questionnaires.length,
            questionnaires: questionnairesResult
        })
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    });
})

router.get('/:id/color', (req, res) => {
    BusinessService.getBusiness({_id: req.params.id}).then((business) => {
        res.status(200).send({
            color: business.color
        })
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    })
})

router.put('/color', authenticate, (req, res) => {
    if(req.body.color) {
        if(req.body.color[0] != '#' || req.body.color.length != 7) {
            return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': "Invalid color" }, res);
        }
    }
    else {
        return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': "Invalid color" }, res);
    }

    BusinessService.updateBusiness({_id: req.business._id}, { color: req.body.color }).then((business) => {
        res.status(200).send({
            business: business
        })
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    })
})

router.post('/signup', async (req, res) => {
    const { error } = signupValidation(req.body);
    if (error) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': error.details[0].message }, res);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", res);

    req.body.password = hashedPassword;

    BusinessService.createBusiness(req.body).then((business) => {
        res.status(200).send({
            business: business
        })
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    });
})

module.exports = router;