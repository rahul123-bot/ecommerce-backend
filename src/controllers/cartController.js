const cartModel = require("../models/cart.model.js");

const getCart = async(req,res)=>{
    try{
        const cart = await cartModel.findOne({
            user: req.user._id,
        }).populate("items.product");
         if (!cart) {

      return res.json({
        items: [],
      });
    }
    res.json(cart)
    }catch(error){
       res.status(500).json({
      message: error.message,
    });
    }
}
const addToCart =
  async (req, res) => {

    try {
     
      
      const { productId } =
        req.body;

      let cart =
        await cartModel.findOne({

          user: req.user._id,

        });

      // CREATE CART
      if (!cart) {

        cart =
          await cartModel.create({

            user: req.user._id,

            items: [],
          });
      }

      // CHECK EXISTING PRODUCT
      const existingItem =
      cart.items.find(
    (item) =>
      item.product &&
      item.product.toString() === productId
  );
  console.log("CART =", JSON.stringify(cart, null, 2));

      // INCREASE QUANTITY
      if (existingItem) {

        existingItem.quantity += 1;
      }

      // ADD NEW PRODUCT
      else {

        cart.items.push({

          product: productId,

          quantity: 1,
        });
      }
     
      await cart.save();
    
        await cartModel
          .findOne({
            user: req.user._id,
          })
          .populate(
            "items.product"
          );

      res.json();

    } catch (error) {
      res.status(500).json({

        message:
          error.message,
      });
    }
};

const removeFromCart = async(req,res)=>{
    try{
        const {productId} = req.params;
        const cart = await cartModel.findOne({
            user: req.user._id
        })
        if(!cart){
            return res.status(404).json({
                "message":"Cart not found"
            })
        }
        cart.items = cart.items.filter(item=>
            item.product.toString()!== 
            productId)
            
            await cart.save();
            res.json(cart)
    }catch(error){
        res.status(500).json({
      message: error.message,
    });
    }
}  
module.exports = {
    getCart,
    addToCart,
    removeFromCart,
}
