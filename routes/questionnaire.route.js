const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ErrorHandler = new (require('../services/error-handling.service').ErrorHandler)();
const QuestionnaireService = new (require('../services/questionnaire.service').QuestionnaireService)();

const { questionnaireValidation, questionnaireCreationValidation } = require('../validation/validation');

const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, (req, res) => {
    const { error } = questionnaireCreationValidation(req.body);
    if (error) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': error.details[0].message }, res);

    QuestionnaireService.createQuestionnaire({ title: req.body.title, businessId: req.business._id }).then((questionnaire) => {
        res.status(200).send({
            questionnaire: questionnaire
        })
    }).catch((err) => {
        return ErrorHandler.returnError(err);
    })
})

router.get('/:id', (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        QuestionnaireService.getQuestionnaire({ _id: req.params.id }).then((questionnaire) => {
            res.status(200).send({
                questionnaire: questionnaire
            })
        }).catch((err) => {
            return ErrorHandler.returnError(err, res);
        })
    } else {
        return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': 'Invalid questionnaire id' }, res);
    }
});

router.put('/', authenticate, (req, res) => {
    const { error } = questionnaireValidation(req.body);
    if (error) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': error.details[0].message }, res);

    QuestionnaireService.getQuestionnaire({ _id: req.body._id }).then((questionnaire) => {
        if (questionnaire.businessId == req.business._id) {
            const id = req.body._id;
            delete req.body._id;

            if (req.body.questions.length <= 0 || req.body.questions.length > 4) {
                return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': "Invalid questions count." }, res);
            }

            QuestionnaireService.updateQuestionnaire({ _id: id }, req.body).then((updateQuestionnaire) => {
                res.status(200).send({
                    updatedQuestionnaire: updateQuestionnaire
                })
            }).catch((err) => {
                return ErrorHandler.returnError(err, res);
            })
        } else {
            return ErrorHandler.returnError({ 'errorCode': 403 }, res);
        }
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    })
})

module.exports = router;