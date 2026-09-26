const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group.controller");
const { authenticate, authorize } = require("../middlewares/auth");

router.post("/", authenticate, authorize("TEACHER", "ADMIN"), groupController.createGroup);
router.get("/my", authenticate, authorize("TEACHER", "ADMIN"), groupController.getMyGroups);
router.get("/student", authenticate, authorize("STUDENT"), groupController.getStudentGroups);
router.get("/:id", authenticate, groupController.getGroupDetail);
router.post("/join/:token", authenticate, groupController.joinGroup);
router.post("/:id/add-student", authenticate, authorize("TEACHER", "ADMIN"), groupController.addStudentToGroup);
router.post("/:id/regenerate-link", authenticate, authorize("TEACHER", "ADMIN"), groupController.regenerateJoinLink);

module.exports = router;
