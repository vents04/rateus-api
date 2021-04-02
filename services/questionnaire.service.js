const { Questionnaire } = require('../db/models/questionnaire.model');

class QuestionnaireService {
    createQuestionnaire(data) {
        return new Promise((resolve, reject) => {
            try {
                new Questionnaire(data).save().then((questionnaire) => {
                    resolve(questionnaire);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                })
            }
        })
    }

    getQuestionnaire(data) {
        return new Promise((resolve, reject) => {
            try {
                Questionnaire.findOne(data).then((questionnaire) => {
                    resolve(questionnaire);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                });
            }
        })
    }
}

module.exports.QuestionnaireService = QuestionnaireService;