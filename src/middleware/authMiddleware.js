const jwt = require("jsonwebtoken");
const userModel = require("../models/users.model.js");
const config = require("../config/config.js")

const protect = async(req,res,next)=>{
    let token ;
    if(req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")){
        try{
           token = req.headers.authorization.split(" ")[1];
           const decoded = jwt.verify(token,config.JWT_TOKEN);
           req.user = await userModel.findById(decoded.id).select("-password");
           next();
        }catch(error){
             res.status(401).json({
        message: "Not authorized",
      });
     }
  }
  if(!token){
    res.status(401).json({
        "message":"no token"
    })
  }
}
module.exports = protect;