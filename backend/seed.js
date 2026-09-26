const { Plan, sequelize } = require("./models");

async function seed() {
  await sequelize.sync();

  const defaultPlans = [
    {
      name: "STARTER",
      title: "Starter",
      description: "Kichik OTMlar (< 5 000 talaba)",
      price_uzs: 12000000,
      duration_days: 365,
      role_target: "ALL",
      features: [
        "Asosiy funksiyalar",
        "AI savollar (limit)",
        "Davomat va baholash",
        "Email qo‘llab-quvvatlash",
      ],
      max_groups: 30,
      ai_credits: 5000,
      is_default: true,
    },
    {
      name: "STANDART",
      title: "Standart",
      description: "O‘rta OTMlar (5 000 – 20 000 talaba)",
      price_uzs: 24000000,
      duration_days: 365,
      role_target: "ALL",
      features: [
        "Barcha asosiy funksiyalar",
        "AI savollar (kengaytirilgan)",
        "Analitika va hisobotlar",
        "Integratsiya (HEMIS va b.)",
        "Texnik qo‘llab-quvvatlash",
      ],
      max_groups: 100,
      ai_credits: 20000,
      is_default: true,
    },
    {
      name: "ENTERPRISE",
      title: "Enterprise",
      description: "Yirik OTMlar (> 20 000 talaba)",
      price_uzs: 36000000,
      duration_days: 365,
      role_target: "ALL",
      features: [
        "Barcha funksiyalar",
        "Cheksiz AI imkoniyatlar",
        "Maxsus integratsiyalar",
        "Dedicated qo‘llab-quvvatlash",
        "Shaxsiy sozlashlar",
      ],
      max_groups: 99999,
      ai_credits: 999999,
      is_default: true,
    },
  ];

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
    const existing = await Plan.findOne({ where: { name: p.name } });
    if (!existing) {
      await Plan.create(p);
      console.log(`Plan ${p.name} yaratildi ✅`);
    } else {
      await existing.update(p);
      console.log(`Plan ${p.name} yangilandi ✅`);
    }
  }

  console.log("Seeding yakunlandi! 3 ta standart B2B tarif mavjud 🚀");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding xatolik:", err);
  process.exit(1);
});
