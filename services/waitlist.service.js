const { Waitlist } = require('../db/models/waitlist.model.js');

class WaitlistService {
    createWaitlist(data) {
        return new Promise((resolve, reject) => {
            try {
                new Waitlist(data).save().then((waitlist) => {
                    resolve(waitlist);
                });
            } catch (err) {
                reject({
                    'errorCode': 500,
                })
            }
        })
    }
}

module.exports.WaitlistService = WaitlistService;