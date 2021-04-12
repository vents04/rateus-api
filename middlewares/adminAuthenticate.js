const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../global');

const AdminService = new(require('../services/admin.service').AdminService)();
const ErrorHandler = new (require('../services/error-handling.service').ErrorHandler)();

let adminAuthenticate = async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (token) {
      try {
          const verified = jwt.verify(token, JWT_SECRET);
          if (verified) {
              try{
                AdminService.getAdmin({ _id: verified._id }).then((admin) => {
                    if(admin) {
                      req.admin = verified;
                      if (verified.iat > admin.lastPasswordReset.getTime() / 1000) {
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

module.exports = adminAuthenticate;
