const { Subscription } = require('../db/models/subscription.model');
const axios = require('axios');

const PaypalService = new(require('./paypal.service').PaypalService)();

class SubscriptionService {
    getActiveSubscription(data) {
        return new Promise((resolve, reject) => {
            try {
                Subscription.find(data).then(async (subscriptions) => {
                    let activeSubscription = null;
                    let message = null;

                    for (let subscription of subscriptions) {
                        await new Promise((resolve, reject) => {
                            PaypalService.getSubscription(subscription.subscriptionId).then((paypalSubscription) => {
                                if (paypalSubscription.status == "ACTIVE" || subscription.status == "APPROVED") {
                                    activeSubscription = subscription;
                                } else if (paypalSubscription.status == "SUSPENDED" || subscription.status == "CANCELED" || subscription.status == "EXPIRED") {
                                    message = "You subscription was canceled, suspended or has expired. You can now active a new one."
                                }
                            }).catch((err) => {
                                reject(err);
                            });
                        })
                    }

                    resolve({
                        activeSubscription: activeSubscription,
                        message: message
                    });
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