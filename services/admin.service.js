const { Admin } = require('../db/models/admin.model');

const BusinessService = new (require('../services/business.service').BusinessService)();

class AdminService {
    getAdmin(data) {
        return new Promise((resolve, reject) => {
            try {
                Admin.findOne(data).lean(true).then((business) => {
                    resolve(business);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                });
            }
        })
    }

    getPendingBusinesses() {
        return new Promise((resolve, reject) => {
            try {
                BusinessService.getBusinesses({status: 0}).then((pendingBusinesses) => {
                    resolve(pendingBusinesses);
                }).catch((err) => {
                    reject(err);
                })
            } catch (err) {
                reject({
                    'errorCode': 500,
                })
            }
        })
    }

    approveBusiness(id) {
        return new Promise((resolve, reject) => {
            try {
                BusinessService.updateBusiness({_id: id}, {status: 1}).then((updatedBusiness) => {
                    resolve(updateBusiness);
                }).catch((err) => {
                    reject(err);
                })
            } catch (err) {
                reject({
                    'errorCode': 500
                })
            }
        })
    }
}

module.exports.AdminService = AdminService;