const express = require("express");
const router = express.Router();

const { getDashboardStats,getSalesAnalytics } = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

const adminOnly = require("../middleware/adminMiddleware");

router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/analytics", protect, adminOnly, getSalesAnalytics);

module.exports = router;
