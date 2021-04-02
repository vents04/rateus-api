class ErrorHandler {
    returnError(data, res) {
        // Save to logs too //
        if(!data.errorMessage) {
            return res.sendStatus(data.errorCode || 500);
        } else {
            return res.status(data.errorCode || 500).send(data.errorMessage);
        }
    }
}

module.exports.ErrorHandler = ErrorHandler;