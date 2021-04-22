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

    getQuestionnaires(data) {
        return new Promise((resolve, reject) => {
            try {
                Questionnaire.find(data).then((questionnaires) => {
                    resolve(questionnaires);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                });
            }
        })
    }

    updateQuestionnaire(findData, updateData) {
        return new Promise((resolve, reject) => {
            try {
                Questionnaire.findOneAndUpdate(findData, updateData).then((questionnaire) => {
                    resolve(questionnaire);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                });
            }
        })
    }

    deleteQuestionnaire(data) {
        return new Promise((resolve, reject) => {
            try {
                Questionnaire.findOneAndDelete(data).then((deleteQuestionnaire) => {
                    resolve(deleteQuestionnaire);
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