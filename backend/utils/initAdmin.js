const { User, Plan } = require("../models");

/**
 * Server ishga tushganda avtomatik ravishda .env dagi ma'lumotlar bilan
 * Admin hisobini va standart tariflarni bazaga kiritadi.
 */
async function initAdminAndPlans() {
  try {
    // 1. Standart Tariflarni (Plans) yaratish
    const defaultPlans = [
      {
        name: "FREE",
        title: "Teacher Free",
        description: "Yangi boshlovchi o'qituvchilar uchun",
        price_uzs: 0,
        duration_days: 365,
        role_target: "TEACHER",
        features: ["Maksimal 3 ta guruh", "Oddiy AI baholash", "Guruh statistikasi"],
        max_groups: 3,
        ai_credits: 50,
      },
      {
        name: "PRO_MONTHLY",
        title: "Teacher Pro (1 oylik)",
        description: "To'liq funksional va cheksiz imkoniyatlar",
        price_uzs: 49000,
        duration_days: 30,
        role_target: "TEACHER",
        features: [
          "Cheksiz guruhlar yaratish",
          "Cheksiz AI baholash & feedback",
          "Plagiat va Similarity tahlili",
          "AI-writing tahlili",
          "Kengaytirilgan o'qituvchi analitikasi",
        ],
        max_groups: 9999,
        ai_credits: 99999,
      },
      {
        name: "ENTERPRISE_STARTER",
        title: "Enterprise Starter",
        description: "Kichik va o'rta universitetlar uchun yillik obuna",
        price_uzs: 15000000,
        duration_days: 365,
        role_target: "ALL",
        features: ["Up to 5 ta Fakultet", "Up to 50 ta O'qituvchi", "Up to 2,500 ta Talaba", "500 ta AI 40-Savol material/oy", "Standard Email Support"],
        max_groups: 100,
        ai_credits: 5000,
      },
      {
        name: "ENTERPRISE_PRO",
        title: "Enterprise Pro",
        description: "Yirik davlat va xususiy universitetlar uchun",
        price_uzs: 43750000,
        duration_days: 365,
        role_target: "ALL",
        features: ["Up to 25 ta Fakultet", "Up to 300 ta O'qituvchi", "Up to 20,000 ta Talaba", "5,000 ta AI 40-Savol material/oy", "HEMIS & LMS Avto-Sync API", "Prioritet VIP Support (4h)"],
        max_groups: 1000,
        ai_credits: 50000,
      },
      {
        name: "ENTERPRISE_UNLIMITED",
        title: "Enterprise Unlimited",
        description: "Cheksiz imkoniyatlarga ega strategik paket",
        price_uzs: 98750000,
        duration_days: 365,
        role_target: "ALL",
        features: ["Cheksiz Fakultetlar", "Cheksiz O'qituvchilar va Talabalar", "Cheksiz AI 40-Savol Generator", "Dedicated Server & Custom Brand", "24/7 Shaxsiy Menejer"],
        max_groups: 99999,
        ai_credits: 999999,
      },
    ];

    for (const p of defaultPlans) {
      const existingPlan = await Plan.findOne({ where: { name: p.name } });
      if (!existingPlan) {
        await Plan.create(p);
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
