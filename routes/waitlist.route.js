const express = require('express');
const router = express.Router();

const ErrorHandler = new(require('../services/error-handling.service').ErrorHandler)();

router.post('/', (req, res) => {
    
});

module.exports = router;