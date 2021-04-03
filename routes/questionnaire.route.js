const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ErrorHandler = new(require('../services/error-handling.service').ErrorHandler)();
const QuestionnaireService = new(require('../services/questionnaire.service').QuestionnaireService)();
const BusinessService = new(require('../services/business.service').BusinessService)();

const { questionnaireValidation } = require('../validation/validation');

router.get('/:id', (req, res) => {
    if(mongoose.Types.ObjectId.isValid(req.params.id)) {
        QuestionnaireService.getQuestionnaire({_id: req.params.id}).then((questionnaire) => {
            res.status(200).send({
                questionnaire: questionnaire
            })
        }).catch((err) => {
            return ErrorHandler.returnError(err, res);
        })
    } else {
        return ErrorHandler.returnError({'errorCode': 400, 'errorMessage': 'Invalid questionnaire id'}, res);
    }
});

router.put('/', authenticate, (req, res) => {
    const { error } = questionnaireValidation(req.body);
    if (error) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': error.details[0].message }, res);

    QuestionnaireService.getQuestionnaire({_id: req.body._id}).then((questionnaire) => {
        if (questionnaire.businessId === req.business._id) {
            
        } else {
            return ErrorHandler.returnError({'errorCode': 403}, res);
        }
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    })
})

module.exports = router;