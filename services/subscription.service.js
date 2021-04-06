const { Subscription } = require('../db/models/subscription.model');
const axios = require('axios');

const PaypalService = new(require('./paypal.service').PaypalService)();

class SubscriptionService {
    getActiveSubscription(data) {
        return new Promise((resolve, reject) => {
            try {
                Subscription.find(data).then(async (subscriptions) => {
                    let activeSubscription = null;

                    for (let subscription of subscriptions) {
                        await new Promise((resolve, reject) => {
                            PaypalService.getSubscription(subscription.subscriptionId).then((paypalSubscription) => {
                                if (paypalSubscription.status == "ACTIVE") {
                                    activeSubscription = subscription;
                                }
                            }).catch((err) => {
                                reject(err);
                            });
                        })
                    }

                    resolve(activeSubscription);
                })
            } catch (err) {
                reject({
                    'errorCode': 500
                })
            }
        })
    }
}

module.exports.SubscriptionService = SubscriptionService;