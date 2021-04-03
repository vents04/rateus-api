const waitlistRoute = require('./waitlist.route');
const businessRoute = require('./business.route');
const questionnaireRoute = require('./questionnaire.route');

module.exports = {
    waitlist: waitlistRoute,
    business: businessRoute,
    questionnaire: questionnaireRoute
}