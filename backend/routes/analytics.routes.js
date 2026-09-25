const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { authenticate, authorize } = require("../middlewares/auth");

router.get("/group/:groupId", authenticate, authorize("TEACHER", "ADMIN"), analyticsController.getGroupAnalytics);

module.exports = router;
