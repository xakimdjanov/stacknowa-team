const { User, Plan } = require("../models");

/**
 * Server ishga tushganda avtomatik ravishda .env dagi ma'lumotlar bilan
 * Admin hisobini va faqat 3 ta rasmiy standart B2B tarifni bazaga kiritadi.
 */
async function initAdminAndPlans() {
  try {
    // 1. Faqat 3 ta rasmiy standart B2B tariflar (Universitetlar uchun)
    const defaultPlans = [
      {
        name: "STARTER",
        title: "Starter",
        description: "Kichik OTMlar (< 5 000 talaba)",
        price_uzs: 12000000,
        duration_days: 365,
        role_target: "ALL",
        is_default: true,
        features: [
          "Asosiy funksiyalar",
          "AI savollar (limit)",
          "Davomat va baholash",
          "Email qo‘llab-quvvatlash",
        ],
        max_groups: 30,
        ai_credits: 5000,
      },
      {
        name: "STANDART",
        title: "Standart",
        description: "O‘rta OTMlar (5 000 – 20 000 talaba)",
        price_uzs: 24000000,
        duration_days: 365,
        role_target: "ALL",
        is_default: true,
        features: [
          "Barcha asosiy funksiyalar",
          "AI savollar (kengaytirilgan)",
          "Analitika va hisobotlar",
          "Integratsiya (HEMIS va b.)",
          "Texnik qo‘llab-quvvatlash",
        ],
        max_groups: 100,
        ai_credits: 20000,
      },
      {
        name: "ENTERPRISE",
        title: "Enterprise",
        description: "Yirik OTMlar (> 20 000 talaba)",
        price_uzs: 36000000,
        duration_days: 365,
        role_target: "ALL",
        is_default: true,
        features: [
          "Barcha funksiyalar",
          "Cheksiz AI imkoniyatlar",
          "Maxsus integratsiyalar",
          "Dedicated qo‘llab-quvvatlash",
          "Shaxsiy sozlashlar",
        ],
        max_groups: 99999,
        ai_credits: 999999,
      },
    ];

    // Eski va ortiqcha sinov tariflarini tozalash
    await Plan.destroy({
      where: {
        name: [
          "ENTERPRISE_STARTER",
          "ENTERPRISE_PRO",
          "ENTERPRISE_UNLIMITED",
          "PRO_MONTHLY",
          "PRO_ANNUAL",
          "FREE",
        ],
      },
    });

    for (const p of defaultPlans) {
      const existingPlan = await Plan.findOne({ where: { name: p.name } });
      if (!existingPlan) {
        await Plan.create(p);
      } else {
        await existingPlan.update(p);
      }
    }

    // 2. Adminni tekshirish va yaratish
    const adminEmail = process.env.ADMIN_EMAIL || "admin@aipractice.uz";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
    const adminName = process.env.ADMIN_NAME || "Super Admin";

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "ADMIN",
        plan_type: "PRO",
      });
      console.log(`Default Admin muvaffaqiyatli yaratildi ✅ (${adminEmail})`);
    }
  } catch (error) {
    console.error("Admin va tariflarni yaratishda xatolik:", error.message);
  }
}

module.exports = initAdminAndPlans;
