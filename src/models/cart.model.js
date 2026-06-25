const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    items:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
            },
            quantity:{
                type: Number,
                default:1,
            },
        },
    ]
},{
     timestamps: true,
})
cartSchema.index({ user: 1 });
const cartModel = mongoose.model("Cart",cartSchema);
module.exports = cartModel;