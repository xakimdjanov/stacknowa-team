const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const { verifyToken } = require("../middlewares/auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 30 * 1024 * 1024 } });

// AI 20 va 40 Savol generatorlari (fayl yuklash bilan)
router.post("/generate-20-questions", verifyToken, upload.single("file"), eventController.generate20Questions);
router.post("/generate-40-questions", verifyToken, upload.single("file"), eventController.generate40Questions);

// O'qituvchining yuklangan dars materiallari va AI quizlari
router.get("/my-materials", verifyToken, eventController.getMyMaterials);

// Live Event yaratish (Game PIN olinadi)
router.post("/create", verifyToken, eventController.createLiveEvent);

// Material tahrirlash (title, group_id)
router.put("/:id", verifyToken, eventController.updateMaterial);

// Material o'chirish
router.delete("/:id", verifyToken, eventController.deleteMaterial);

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
