const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { authenticate, authorize } = require("../middlewares/auth");

// Overview analytics for teacher / university / admin dashboard
router.get("/overview", authenticate, authorize("TEACHER", "ADMIN", "UNIVERSITY_ADMIN"), analyticsController.getOverviewAnalytics);

// Specific group analytics
router.get("/group/:groupId", authenticate, authorize("TEACHER", "ADMIN", "UNIVERSITY_ADMIN"), analyticsController.getGroupAnalytics);

// Specific student analytics & struggle diagnostics
router.get("/student/:studentId", authenticate, authorize("TEACHER", "ADMIN", "UNIVERSITY_ADMIN"), analyticsController.getStudentAnalytics);

module.exports = router;
