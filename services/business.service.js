const { Business } = require('../db/models/business.model');

class BusinessService {
    createBusiness(data) {
        return new Promise((resolve, reject) => {
            try {
                new Business(data).save().then((business) => {
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
                Business.findOne(data).then((business) => {
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