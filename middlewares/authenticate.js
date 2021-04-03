const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../global');

const BusinessService = new(require('../services/business.service').BusinessService)();
const ErrorHandler = new (require('../services/error-handling.service').ErrorHandler)();

let authenticate = async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (token) {
      try {
          const verified = jwt.verify(token, JWT_SECRET);
          if (verified) {
              try{
                  BusinessService.getBusiness({ _id: verified._id }).then((business) => {
                    if(business) {
                      req.business = verified;
                      if (verified.iat > business.lastPasswordReset.getTime() / 1000) {
                          req.token = token;
                          next();
                      } else {
                        return ErrorHandler.returnError({'errorCode': 401}, res);
                      }
                    }else{
                      return ErrorHandler.returnError({'errorCode': 401}, res);
                    }
                  }).catch((err) => {
                    return ErrorHandler.returnError(err, res);
                  });
              }catch(err){
                return ErrorHandler.returnError({'errorCode': 500}, res);
              }
          } else {
            return ErrorHandler.returnError({'errorCode': 401}, res);
          }
      } catch (err) {
        return ErrorHandler.returnError({'errorCode': 401}, res);
      }
    } else {
      return ErrorHandler.returnError({'errorCode': 401}, res);
    }
}

module.exports = authenticate;
