const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth");

router.get("/", authenticate, authorize("ADMIN"), userController.getAllUsers);
router.post("/", authenticate, authorize("ADMIN"), userController.createUser);
router.put("/:id", authenticate, authorize("ADMIN"), userController.updateUser);
router.delete("/:id", authenticate, authorize("ADMIN"), userController.deleteUser);

module.exports = router;
