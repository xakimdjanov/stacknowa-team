const { Plan, sequelize } = require("./models");

async function seed() {
  await sequelize.sync();

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
        "AI-writing (neyrotarmoq yozuvi) tahlili",
        "Kengaytirilgan o'qituvchi analitikasi",
      ],
      max_groups: 9999,
      ai_credits: 99999,
    },
    {
      name: "PRO_ANNUAL",
      title: "Teacher Pro (1 yillik)",
      description: "1 yillik chegirmali Pro obuna",
      price_uzs: 390000,
      duration_days: 365,
      role_target: "TEACHER",
      features: [
        "Cheksiz guruhlar yaratish",
        "Cheksiz AI baholash & feedback",
        "Plagiat va Similarity tahlili",
        "AI-writing tahlili",
        "Prioritet qo'llab-quvvatlash",
      ],
      max_groups: 9999,
      ai_credits: 999999,
    },
  ];

  for (const p of defaultPlans) {
    const existing = await Plan.findOne({ where: { name: p.name } });
    if (!existing) {
      await Plan.create(p);
      console.log(`Plan qo'shildi: ${p.title}`);
    }
  }

  console.log("Boshlang'ich tariflar muvaffaqiyatli yuklandi ✅");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
