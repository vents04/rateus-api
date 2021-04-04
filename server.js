const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoDb = require('./db/mongoose');
const helmet = require("helmet");
const { ROOT_URL, ROOT_URL_FRONTEND } = require('./global');

const allowedOrigins = [ROOT_URL, ROOT_URL_FRONTEND];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(msg, false);
        }
        return callback(null, true);
    }
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,auth-token');
    res.setHeader('Access-Control-Expose-Headers', '*');
    next();
});

app.use(bodyParser.json({ limit: '50MB' })).use(express.urlencoded({ extended: true }));

app.use(helmet());

const {
    waitlist,
    business,
    questionnaire,
    answer,
    language,
} = require('./routes/all-routes.import');

app.use('/waitlist', waitlist);
app.use('/business', business);
app.use('/questionnaire', questionnaire);
app.use('/answer', answer);
app.use('/language', language);

app.listen(process.env.PORT || 8081, () => {
    console.log("Server listening on port 8081");
});