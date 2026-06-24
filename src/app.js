const express = require("express");
const cors = require("cors");
const app = express();
const aiRoutes = require("./routes/aiRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const wishlistRoutes = require("./routes/wishlistRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");


app.use(express.json({ limit: '50mb' }))
app.use(cors());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.get("/",(req,res)=>{
    res.send("backend running")
});
app.use("/api/ai",aiRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/wishlist",wishlistRoutes);
app.use("/api/dashboard",dashboardRoutes);


module.exports = app;
