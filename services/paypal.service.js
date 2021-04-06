const axios = require('axios');
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = require('../global');

class PaypalService {
    getAccessToken() {
        return new Promise((resolve, reject) => {
            try {
                axios.post({
                    url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
                    method: 'post',
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
                    },
                }).then((response) => {
                    resolve(JSON.parse(response).access_token);
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
                    axios.get({
                        url: `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }).then((response) => {
                        resolve(JSON.parse(response));
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
}

module.exports.PaypalService = PaypalService;