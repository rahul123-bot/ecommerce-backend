const Razorpay = require ("razorpay");

const config = require("../config/config.js");

const razorpay = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_SECRET,
})
const CreateOrder = async(req,res)=>{
    try{  
     
        const {amount} = req.body ;
        const option = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        }
        const order = await razorpay.orders.create(option);
        res.json (order);
    }catch(error){
         res.status(500).json({
         message: error.message,
        });

    }
}
module.exports = {
    CreateOrder,
};
