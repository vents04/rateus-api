const waitlistRoute = require('./waitlist.route');
const businessRoute = require('./business.route');
const questionnaireRoute = require('./questionnaire.route');
const answerRoute = require('./answer.route');
const languageRoute = require('./language.route');
const subscriptionRoute = require('./subscription.route');

module.exports = {
    waitlist: waitlistRoute,
    business: businessRoute,
    questionnaire: questionnaireRoute,
    answer: answerRoute,
    language: languageRoute,
    subscription: subscriptionRoute
}