const { Plan, Transaction, User } = require("../models");
const inpayService = require("../services/inpay.service");
const Joi = require("joi");

const planSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  price_uzs: Joi.number().integer().min(0).required(),
  duration_days: Joi.number().integer().default(30),
  role_target: Joi.string().valid("ALL", "TEACHER", "STUDENT").default("TEACHER"),
  features: Joi.array().items(Joi.string()).default([]),
  max_groups: Joi.number().integer().default(10),
  ai_credits: Joi.number().integer().default(100),
});

/**
 * 1. Admin yangi tarif qo'shishi (Create Plan)
 */
exports.createPlan = async (req, res) => {
  try {
    const { error, value } = planSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const plan = await Plan.create(value);
    return res.status(201).json({ success: true, message: "Tarif yaratildi", plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Barcha faol tariflarni olish (Foydalanuvchilar ko'rishi uchun)
 */
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll({
      where: { is_active: true },
      order: [["price_uzs", "ASC"]],
    });
    return res.status(200).json({ success: true, plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Admin tarifni tahrirlashi (Update Plan)
 */
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);
    if (!plan) return res.status(404).json({ success: false, message: "Tarif topilmadi" });

    await plan.update(req.body);
    return res.status(200).json({ success: true, message: "Tarif yangilandi", plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. inPAY orqali to'lov boshlash (Create inPAY Payment Invoice)
 */
exports.subscribeWithInPay = async (req, res) => {
  try {
    const { plan_id, payment_method, phone } = req.body;

    const plan = await Plan.findByPk(plan_id);
    if (!plan) return res.status(404).json({ success: false, message: "Tarif topilmadi" });

    if (plan.price_uzs <= 0) {
      // Bepul tarif
      req.user.plan_type = "FREE";
      await req.user.save();
      return res.status(200).json({ success: true, message: "Free tarif faollashtirildi" });
    }

    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

    // inPAY API ga so'rov jo'natish
    const inpayResponse = await inpayService.createPayment({
      amount: plan.price_uzs,
      description: `${plan.title} obunasi`,
      paymentMethod: payment_method, // click, payme, cardsystem
      phone: phone || "",
      clientIp: clientIp.split(",")[0].trim(),
    });

    if (!inpayResponse.success) {
      return res.status(400).json({ success: false, message: inpayResponse.message || "To'lov yaratishda xatolik" });
    }

    // Tranzaksiyani DB ga yozish
    const transaction = await Transaction.create({
      order_id: inpayResponse.order_id,
      user_id: req.user.id,
      plan_id: plan.id,
      amount: plan.price_uzs,
      payment_method: payment_method || "inpay",
      status: "pending",
      pay_url: inpayResponse.pay_url,
      phone: phone || inpayResponse.phone,
    });

    return res.status(200).json({
      success: true,
      message: "To'lov havolasi yaratildi",
      order_id: inpayResponse.order_id,
      pay_url: inpayResponse.pay_url,
      transaction,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. inPAY Webhook (To'lov muvaffaqiyatli bo'lganda inPAY serveri yuboradi)
 */
exports.inpayWebhook = async (req, res) => {
  try {
    console.log("inPAY Webhook Received:", req.body);
    const { order_id, status, transaction_id, amount } = req.body;

    if (!order_id) {
      return res.status(400).send("Invalid webhook data");
    }

    const transaction = await Transaction.findOne({
      where: { order_id },
      include: [
        { model: Plan, as: "plan" },
        { model: User, as: "user" },
      ],
    });

    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    transaction.raw_webhook_data = req.body;
    if (transaction_id) transaction.inpay_transaction_id = transaction_id;

    if (status === "success") {
      transaction.status = "success";
      transaction.paid_at = new Date();
      await transaction.save();

      // Foydalanuvchiga Pro obunani yoqish
      const user = transaction.user;
      const plan = transaction.plan;
      if (user && plan) {
        user.plan_type = "PRO";
        const expires = new Date();
        expires.setDate(expires.getDate() + (plan.duration_days || 30));
        user.plan_expires_at = expires;
        await user.save();
      }
    } else if (status === "failed") {
      transaction.status = "failed";
      await transaction.save();
    }

    // inPAY qoidasi: Har doim HTTP 200 qaytarish shart
    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(200).send("OK"); // Retrying oldini olish uchun 200
  }
};

/**
 * 6. Foydalanuvchining so'nggi to'lov statusini tekshirish va PRO ni yangilash
 */
exports.checkMyPaymentStatus = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
      include: [{ model: Plan, as: "plan" }],
    });

    if (!transaction) {
      return res.status(200).json({ success: true, status: "none", user: req.user });
    }

    // Agar status hali pending bo'lsa, inPAY serveridan tekshiramiz
    if (transaction.status === "pending") {
      try {
        const inpayStatus = await inpayService.getTransactionStatus(transaction.order_id);
        if (inpayStatus && inpayStatus.success && inpayStatus.status === "success") {
          transaction.status = "success";
          transaction.paid_at = new Date();
          await transaction.save();

          req.user.plan_type = "PRO";
          const expires = new Date();
          expires.setDate(expires.getDate() + (transaction.plan?.duration_days || 30));
          req.user.plan_expires_at = expires;
          await req.user.save();
        }
      } catch (e) {
        console.error("inPAY tekshirishda xatolik:", e.message);
      }
    }

    return res.status(200).json({
      success: true,
      status: transaction.status,
      transaction,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        plan_type: req.user.plan_type,
        plan_expires_at: req.user.plan_expires_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 7. Admin uchun barcha to'lovlar (Tranzaksiyalar) ro'yxati
 */
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Plan, as: "plan", attributes: ["id", "name", "title"] },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
