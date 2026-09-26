const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const { verifyToken } = require("../middlewares/auth");

// AI 20 va 40 Savol generatorlari
router.post("/generate-20-questions", verifyToken, eventController.generate20Questions);
router.post("/generate-40-questions", verifyToken, eventController.generate40Questions);

// O'qituvchining yuklangan dars materiallari va AI quizlari
router.get("/my-materials", verifyToken, eventController.getMyMaterials);

// Live Event yaratish (Game PIN olinadi)
router.post("/create", verifyToken, eventController.createLiveEvent);

// Game PIN bilan eventga ulanish & Online davomat olish (Student Join)
router.post("/join", eventController.joinEventByPin);

// Eventni boshlash (Start Quiz)
router.put("/:id/start", verifyToken, eventController.startEvent);

// Keyingi savolga o'tish
router.put("/:id/next", verifyToken, eventController.nextQuestion);

// Javob yuborish (Student option click)
router.post("/submit-answer", eventController.submitAnswer);

// Event live holati va davomat jadvali
router.get("/:id/live-state", eventController.getEventLiveState);

module.exports = router;
