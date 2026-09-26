const express = require("express");
const router = express.Router();
const planController = require("../controllers/plan.controller");
const { authenticate, authorize } = require("../middlewares/auth");

// Public / Barcha ko'ra oladigan tariflar
router.get("/", planController.getPlans);

// Admin boshqaruvi
router.post("/", authenticate, authorize("ADMIN"), planController.createPlan);
router.put("/:id", authenticate, authorize("ADMIN"), planController.updatePlan);
router.delete("/:id", authenticate, authorize("ADMIN"), planController.deletePlan);

// Barcha to'lov tranzaksiyalari (Admin va OTM uchun barchasi, O'qituvchilar uchun o'ziningki)
router.get("/transactions", authenticate, planController.getAllTransactions);

// To'lov boshlash (Authenticated)
router.post("/subscribe", authenticate, planController.subscribeWithInPay);

// Foydalanuvchining to'lov holatini tekshirish va profilni yangilash
router.get("/my-status", authenticate, planController.checkMyPaymentStatus);

// inPAY Webhook (inPAY serveri chaqiradi)
router.post("/inpay/webhook", planController.inpayWebhook);

module.exports = router;
