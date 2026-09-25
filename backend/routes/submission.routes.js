const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submission.controller");
const { authenticate, authorize } = require("../middlewares/auth");

router.post("/draft", authenticate, authorize("STUDENT"), submissionController.saveDraft);
router.post("/submit", authenticate, authorize("STUDENT"), submissionController.submitWork);
router.get("/:id", authenticate, submissionController.getSubmissionDetail);
router.get("/assignment/:assignmentId", authenticate, authorize("TEACHER", "ADMIN"), submissionController.getAssignmentSubmissions);

module.exports = router;
