const express = require('express');
const router = express.Router();

const ErrorHandler = new(require('../services/error-handling.service').ErrorHandler)();
const LanguageService = new(require('../services/language.service').LanguageService)();

router.get('/:language/:page', (req, res) => {
    LanguageService.getLanguageData(req.params.language, req.params.page).then((languageData) => {
        console.log(languageData)
        res.status(200).send({
            languageData: languageData
        })
    }).catch((err) => {
        return ErrorHandler.returnError(err, res);
    })
});

module.exports = router;