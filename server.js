const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoDb = require('./db/mongoose');
const { ROOT_URL, ROOT_URL_FRONTEND, ROOT_URL_KEEPER } = require('./global');

const allowedOrigins = [ROOT_URL, ROOT_URL_FRONTEND, ROOT_URL_KEEPER];

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
    res.setHeader('X-Powered-By', 'Hello, world!');
    next();
});

app.use(bodyParser.json({ limit: '100MB' })).use(express.urlencoded({ extended: true }));

const {
    waitlist
} = require('./routes/all-routes.import');

app.use('/waitlist', waitlist);

app.listen(process.env.PORT || 8080, () => {
    console.log("Server listening on port 8080");
});