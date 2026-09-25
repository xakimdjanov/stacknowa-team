const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignment.controller");
const { authenticate, authorize } = require("../middlewares/auth");

router.get("/all", authenticate, authorize("ADMIN"), assignmentController.getAllAssignments);
router.post("/", authenticate, authorize("TEACHER", "ADMIN"), assignmentController.createAssignment);
router.get("/group/:groupId", authenticate, assignmentController.getGroupAssignments);
router.get("/:id", authenticate, assignmentController.getAssignmentDetail);
router.put("/:id", authenticate, authorize("TEACHER", "ADMIN"), assignmentController.updateAssignment);
router.delete("/:id", authenticate, authorize("TEACHER", "ADMIN"), assignmentController.deleteAssignment);

module.exports = router;
