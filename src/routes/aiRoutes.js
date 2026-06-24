const express = require("express");
const router = express.Router();
const aiChat = require("../controllers/aiController.js");
const protect = require("../middleware/authMiddleware.js")

router.post("/chat",protect,aiChat);
module.exports = router;