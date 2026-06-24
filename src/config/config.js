const dotenv = require("dotenv");
require("dotenv").config();

const config = {
    MONGODB_URI : process.env.MONGODB_URI,
    JWT_TOKEN: process.env.JWT_TOKEN,
    port:process.env.PORT,
   // host:process.env.HOST,//
    openAi_api_key:process.env.OPENAI_API_KEY,
    RAZORPAY_KEY_ID:process.env.RAZORPAY_KEY_ID,
    RAZORPAY_SECRET:process.env.RAZORPAY_SECRET,
}
module.exports = config;