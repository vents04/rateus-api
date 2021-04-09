const { Subscription } = require('../db/models/subscription.model');

const PaypalService = new (require('./paypal.service').PaypalService)();
const BusinessService = new (require('./business.service').BusinessService)();

class SubscriptionService {
    getActiveSubscription(data) {
        return new Promise((resolve, reject) => {
            try {
                Subscription.find(data).then(async (subscriptions) => {
                    let activeSubscription = null;
                    let activePaypalSubscription = null;
                    let plan = null;
                    let message = null;
                    let canIssueNewSubscription = false;

                    if (subscriptions.length == 0) canIssueNewSubscription = true;

                    for (let subscription of subscriptions) {
                        await new Promise((resolve, reject) => {
                            PaypalService.getSubscription(subscription.subscriptionId).then(async (paypalSubscription) => {
                                if (paypalSubscription) {
                                    if (paypalSubscription.status == "ACTIVE" || subscription.status == "APPROVED") {
                                        activeSubscription = subscription;
                                        activePaypalSubscription = paypalSubscription;
                                        await new Promise((resolve, reject) => {
                                            PaypalService.getPlan(activePaypalSubscription.plan_id).then((paypalPlan) => {
                                                plan = paypalPlan;
                                                resolve();
                                            })
                                        })
                                    } else if (paypalSubscription.status == "SUSPENDED" || subscription.status == "CANCELED" || subscription.status == "EXPIRED") {
                                        message = "You subscription was canceled, suspended or has expired. You can now active a new one."
                                        canIssueNewSubscription = true;
                                    } else {
                                        Subscription.findOneAndDelete({ subscriptionId: subscription.subscriptionId }).then(() => {

                                        });
                                    }
                                }
                                resolve();
                            }).catch((err) => {
                                reject(err);
                            });
                        })
                    }

                    resolve({
                        activeSubscription: activeSubscription,
                        activePaypalSubscription: activePaypalSubscription,
                        plan: plan,
                        message: message,
                        canIssueNewSubscription: canIssueNewSubscription
                    });
                })
            } catch (err) {
                reject({
                    'errorCode': 500
                })
            }
        })
    }

    createSubscription(planId, businessId) {
        return new Promise((resolve, reject) => {
            try {
                this.getActiveSubscription({ businessId: businessId }).then((response) => {
                    if (response.canIssueNewSubscription) {
                        BusinessService.getBusiness({ _id: businessId }).then((business) => {
                            PaypalService.createSubscription(planId, business.email).then((paypalSubscription) => {
                                console.log(paypalSubscription);
                                var tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                tomorrow = tomorrow.toISOString();

                                let subscription = new Subscription({
                                    businessId: businessId,
                                    subscriptionId: paypalSubscription.id,
                                    from: tomorrow
                                });
                                try {
                                    subscription.save().then((subscription) => {
                                        resolve(paypalSubscription);
                                    })
                                } catch (err) {
                                    reject({
                                        'errorCode': 500
                                    })
                                }
                            }).catch((err) => {
                                reject(err);
                            })
                        })
                    } else {
                        reject({
                            'errorCode': 400,
                            'errorMessage': 'You cannot create a new subscription'
                        })
                    }
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

module.exports.SubscriptionService = SubscriptionService;