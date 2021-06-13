const keys = require("../app/config");
const jwt = require("jsonwebtoken");
const jwtConfig = {
  secretOrKey: keys.secretKey,
  expiresIn: "2days",
};

const User = require("../models/User");

module.exports = function tokenChecker(req, res, next) {
  let error = {
    description:
      "Le token n'est pas correct, vérifiez le et tentez de vous reconnecter",
    code: "TokenNOK",
  };
  try {
    console.log(req.headers)
    const access_token = req.headers.authorization // Bearer: token
      ? req.headers.authorization
      .match(/^(\S+)\s(.*)/)
      .slice(1)[1]
      .trim() //ne récupère que le token dans Bearer: token
      : null;
    
    if (access_token){
        const {id}  = jwt.verify(access_token, jwtConfig.secretOrKey); // uuid ou le _id si on avait utilisé le user._id
        
        User.findOne({uuid: id}).then((user)=>{
            if (user){
                delete user["password"];
                const r = {
                    user: user,
                    code: "ValidToken", 
                    description: "Token approuvé"
                }
                req.data = r;
                next();
            }
        })
    }else if (req.originalUrl.includes("uploads")){
        next();
    }else{
        // error.description = "Ma nouvelle description";
        throw error
    }
  } catch (err) {
      req.error = err;
      next();
    //   res.status(403).send(err);
  }
};
