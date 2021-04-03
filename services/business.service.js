const { Business } = require('../db/models/business.model');
const QuestionnaireService = new(require('./questionnaire.service').QuestionnaireService)();

class BusinessService {
    createBusiness(data) {
        return new Promise((resolve, reject) => {
            try {
                new Business(data).save().then(async (business) => {
                    await QuestionnaireService.createQuestionnaire({title: `${business.name}'s questionnaire`, businessId: business._id});
                    resolve(business);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                })
            }
        })
    }

    getBusiness(data) {
        return new Promise((resolve, reject) => {
            try {
                Business.findOne(data).lean(true).then((business) => {
                    resolve(business);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                });
            }
        })
    }
}

module.exports.BusinessService = BusinessService;