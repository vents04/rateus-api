const express = require('express');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();
const mongoose = require('mongoose');

const ErrorHandler = new(require('../services/error-handling.service').ErrorHandler)();
const AnswerService = new(require('../services/answer.service').AnswerService)();
const QuestionnaireService = new(require('../services/questionnaire.service').QuestionnaireService)();

const { createAnswerValidation } = require('../validation/validation');

router.post('/', authenticate, (req, res) => {
    const { error } = createAnswerValidation(req.body);
    if (error) return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': error.details[0].message }, res);

    QuestionnaireService.getQuestionnaire({ _id: req.body.questionnaireId }).then((questionnaire) => {
        if(questionnaire != null) {
            AnswerService.createAnswer(req.body).then((answer) => {
                res.status(200).send({
                    answer: answer
                })
            }).catch((err) => {
                return ErrorHandler.returnError(err, res);
            });
        } else {
            return ErrorHandler.returnError({ 'errorCode': 400, 'errorMessage': "No such questionnaire." }, res);
        }
    })
});

router.get('/:id', (req, res) => {
    if(mongoose.Types.ObjectId.isValid(req.params.id)) {
        AnswerService.getAnswer({_id: req.params.id}).then((answer) => {
            res.status(200).send({
                answer: answer
            })
        }).catch((err) => {
            return ErrorHandler.returnError(err, res);
        })
    } else {
        return ErrorHandler.returnError({'errorCode': 400, 'errorMessage': 'Invalid answer id'}, res);
    }
});

router.get('/by-questionnaire-id/:id', authenticate, (req, res) => {
    if(mongoose.Types.ObjectId.isValid(req.params.id)) {
        QuestionnaireService.getQuestionnaire({ _id: req.params.id }).then((questionnaire) => {
            if(questionnaire.businessId != req.business._id) {
                return ErrorHandler.returnError({'errorCode': 403, 'errorMessage': 'Invalid questionnaire id'}, res);
            }
            AnswerService.getAnswers({questionnaireId: req.params.id}).then((answers) => {
                res.status(200).send({
                    answers: answers,
                    questionsCount: questionnaire.questions.length,
                })
            })
        }).catch((err) => {
            return ErrorHandler.returnError(err, res);
        })
    } else {
        return ErrorHandler.returnError({'errorCode': 400, 'errorMessage': 'Invalid answer id'}, res);
    }
});

module.exports = router;