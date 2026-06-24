const mongoose = require("mongoose");
const config = require("./config.js");

async function connectDB(){
    try{
       await mongoose.connect(config.MONGODB_URI);
       console.log("mongoDB is connected");
    }catch(error){
       console.log(error)
    }
}

module.exports = connectDB