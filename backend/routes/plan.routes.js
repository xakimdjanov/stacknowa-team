const express = require("express");
const router = express.Router();
const planController = require("../controllers/plan.controller");
const { authenticate, authorize } = require("../middlewares/auth");

// Public / Barcha ko'ra oladigan tariflar
router.get("/", planController.getPlans);

// Admin boshqaruvi
router.post("/", authenticate, authorize("ADMIN"), planController.createPlan);
router.put("/:id", authenticate, authorize("ADMIN"), planController.updatePlan);

// Admin uchun barcha to'lov tranzaksiyalari ro'yxati
router.get("/transactions", authenticate, authorize("ADMIN"), planController.getAllTransactions);

// To'lov boshlash (Authenticated)
router.post("/subscribe", authenticate, planController.subscribeWithInPay);

// Foydalanuvchining to'lov holatini tekshirish va profilni yangilash
router.get("/my-status", authenticate, planController.checkMyPaymentStatus);

// inPAY Webhook (inPAY serveri chaqiradi)
router.post("/inpay/webhook", planController.inpayWebhook);

module.exports = router;
