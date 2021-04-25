const { Questionnaire } = require('../db/models/questionnaire.model');

const AnswerService = new (require('../services/answer.service').AnswerService)();

var randomstring = require("randomstring");
const ObjectsToCsv = require('objects-to-csv')

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

    createCSV(questionnaireId) {
        return new Promise((resolve, reject) => {
            this.getQuestionnaire({_id: questionnaireId}).then((questionnaire) => {
                const fileName = randomstring.generate();

                let questions = [];
                for (let question of questionnaire.questions) {
                    questions.push(question.title);         
                }

                let data = new Array();
                AnswerService.getAnswers({questionnaireId: questionnaireId}).then(async (answers) => {
                    let answersCounter = 1;
                    for (let answerObject of answers) {
                        let answerObjectToBePushed = new Object();
                        answerObjectToBePushed[""] = answersCounter.toString();
                        answerObjectToBePushed["Date and time"] = answerObject.dt.toString();
                        for(let question of questions) {
                            answerObjectToBePushed[question.toString()] = "";
                        }
                        let index = 0;
                        for (let answer of answerObject.answers) {
                            answerObjectToBePushed[questions[index].toString()] = answer.answer;
                            index++;
                        } 
                        data.push(answerObjectToBePushed);
                        answersCounter++;
                    }

                    const csv = new ObjectsToCsv(data);
                    await csv.toDisk(`./csvs/${fileName}.csv`);
                    resolve(fileName);
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        })
    }
}

module.exports.QuestionnaireService = QuestionnaireService;