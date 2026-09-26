module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define(
    "Plan",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // "FREE", "PRO_MONTHLY", "PRO_ANNUAL", "STUDENT_PLUS"
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false, // "O'qituvchi Pro (1 oylik)"
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price_uzs: {
        type: DataTypes.INTEGER,
        allowNull: false, // e.g. 50000 (so'm)
        defaultValue: 0,
      },
      duration_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
      role_target: {
        type: DataTypes.ENUM("ALL", "TEACHER", "STUDENT"),
        defaultValue: "TEACHER",
      },
      features: {
        type: DataTypes.JSONB, // [ "Cheksiz guruhlar", "AI Evaluation cheksiz", "Plagiat tahlili" ]
        defaultValue: [],
      },
      max_groups: {
        type: DataTypes.INTEGER,
        defaultValue: 3, // Free = 3, Pro = 9999
      },
      ai_credits: {
        type: DataTypes.INTEGER,
        defaultValue: 50,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  Plan.associate = (models) => {
    Plan.hasMany(models.Transaction, { foreignKey: "plan_id", as: "transactions" });
  };

  return Plan;
};
