const axios = require('axios');
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET, ROOT_URL_FRONTEND } = require('../global');

const { Subscription } = require('../db/models/subscription.model');

const BusinessService = new(require('./business.service').BusinessService)();

class PaypalService {
    getAccessToken() {
        return new Promise((resolve, reject) => {
            try {
                axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', {}, {
                    headers: {
                        Accept: 'application/json',
                        'Accept-Language': 'en_US',
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    auth: {
                        username: PAYPAL_CLIENT_ID,
                        password: PAYPAL_SECRET,
                    },
                    params: {
                        grant_type: 'client_credentials',
                    }
                }).then((response) => {
                    resolve(response.data.access_token);
                });
            } catch (err) {
                reject({
                    'errorCode': 500
                });
            }
        });
    }

    getSubscription(subscriptionId) {
        return new Promise((resolve, reject) => {
            this.getAccessToken().then((accessToken) => {
                try {
                    axios.get(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }).then((response) => {
                        resolve(response.data);
                    }).catch((err) => {
                        if (err.response.status == 404) {
                            Subscription.findOneAndDelete({subscriptionId: subscriptionId}).then((deletedObject) => {
                                resolve(null);
                            })
                        } else {
                            reject({
                                'errorCode': err.response.status
                            })
                        }
                    });
                } catch (err) {
                    reject({
                        'errorCode': 500
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    createSubscription(planId, businessEmail) {
        return new Promise((resolve, reject) => {
            this.getAccessToken().then((accessToken) => {
                try {   
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow = tomorrow.toISOString();
                    axios.post('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
                        "plan_id": `${planId}`,
                        "start_time": tomorrow,
                        "subscriber": {
                            "email_address": `${businessEmail}`
                        },
                        "application_context": {
                            "brand_name": 'Uploy | Rate us',
                            "locale": "bg-BG",
                            "shipping_preference": "NO_SHIPPING",
                            "user_action": "SUBSCRIBE_NOW",
                            "payment_method": {
                                "payer_selected": "PAYPAL",
                                "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
                            },
                            "return_url": `https://google.com`,
                            "cancel_url": `https://google.com`
                        }
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                            'Prefer': 'representation',
                            'Content-Type': 'application/json'
                        },
                    }).then((response) => {
                        resolve(response.data);
                    }).catch((err) => {
                        reject({
                            'errorCode': err.response.status
                        })
                    });
                } catch (err) {
                    reject({
                        'errorCode': 500
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getPlan(planId) {
        return new Promise((resolve, reject) => {
            this.getAccessToken().then((accessToken) => { 
                try {
                    axios.get(`https://api-m.sandbox.paypal.com/v1/billing/plans/${planId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }).then((response) => {
                        resolve(response.data);
                    }).catch((err) => {
                        reject({
                            'errorCode': err.response.status
                        })
                    });
                } catch (err) {
                    reject({
                        'errorCode': 500
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        })
    }
}

module.exports.PaypalService = PaypalService;