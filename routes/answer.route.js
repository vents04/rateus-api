const express = require('express');
const router = express.Router();

const ErrorHandler = new(require('../services/error-handling.service').ErrorHandler)();
const AnswerService = new(require('../services/answer.service').AnswerService)();
const QuestionnaireService = new(require('../services/questionnaire.service').QuestionnaireService)();

const { createAnswerValidation } = require('../validation/validation');

router.post('/', (req, res) => {
    const { error } = createAnswerValidation(req.body);
    if (error) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': error.details[0].message }, res);

    QuestionnaireService.getQuestionnaire({ _id: req.body.questionnaireId }).then((questionnaire) => {
        if(questionnaire == null) {
            return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': "No such questionnaire." }, res);
        }
    })

    AnswerService.createAnswer(req.body).then((answer) => {
        res.status(200).send({
            answer: answer
        })
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    });
});

module.exports = router;