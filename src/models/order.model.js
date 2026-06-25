const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"product",
            },
            quantity:Number,
        },
    ],
    shippingAddress:{
        address: String,
        city: String,
        state: String,
        postalCode: String,
        phone: String,
    },
    totalPrice: Number,
    paymentMethod: {
        type: String,
        enum: ["COD", "Razorpay"],
        required: true
    },
    paymentStatus:{
        type:String,
        enum:[
            "Pending",
            "Paid",
            "Failed"
        ],
        default:"Pending"
    },

    status:{
        type: String,
        enum:[
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
        ],
         default:"Pending",
    },
},
{
    timestamps:true,
});
orderSchema.index({ user: 1 });

orderSchema.index({ createdAt: -1 });

orderSchema.index({ status: 1 });
const orderModel = mongoose.model("order",orderSchema);
module.exports = orderModel;