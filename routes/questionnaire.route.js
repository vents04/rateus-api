const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ErrorHandler = new(require('../services/error-handling.service').ErrorHandler)();
const QuestionnaireService = new(require('../services/questionnaire.service').QuestionnaireService)();

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

module.exports = router;