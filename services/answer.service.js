const { Answer } = require('../db/models/answer.model');

class AnswerService {
    createAnswer(data) {
        return new Promise((resolve, reject) => {
            try {
                new Answer(data).save().then((answer) => {
                    resolve(answer);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                })
            }
        })
    }

    getAnswer(data) {
        return new Promise((resolve, reject) => {
            try {
                Answer.findOne(data).then((answer) => {
                    resolve(answer);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                });
            }
        })
    }

    getAnswer(data) {
        return new Promise((resolve, reject) => {
            try {
                Answer.find(data).then((answers) => {
                    resolve(answers);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                });
            }
        })
    }
}

module.exports.AnswerService = AnswerService;