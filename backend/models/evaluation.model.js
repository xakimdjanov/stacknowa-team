module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define(
    "Evaluation",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      submission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      total_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      max_score: {
        type: DataTypes.FLOAT,
        defaultValue: 100,
      },
      criteria_results: {
        type: DataTypes.JSONB, // [ { name: "Theory", score: 18, max: 20, comment: "..." }, ... ]
        allowNull: false,
      },
      template_compliance: {
        type: DataTypes.FLOAT, // e.g. 100%
        defaultValue: 100,
      },
      feedback: {
        type: DataTypes.JSONB, // [ "Yaxshi yoritilgan", "Amaliy qismda xatolik bor" ] or string
        allowNull: true,
      },
      similarity_score: {
        type: DataTypes.FLOAT, // e.g. 15.5 (%)
        defaultValue: 0,
      },
      similarity_details: {
        type: DataTypes.JSONB, // Details of matched submissions
        allowNull: true,
      },
      ai_writing_probability: {
        type: DataTypes.FLOAT, // e.g. 0.35 (35%)
        defaultValue: 0,
      },
      ai_writing_confidence: {
        type: DataTypes.STRING, // Low, Medium, High
        defaultValue: "Low",
      },
      ai_writing_indicators: {
        type: DataTypes.JSONB, // [ "generic phrasing", ... ]
        defaultValue: [],
      },
      evaluated_by: {
        type: DataTypes.STRING, // "AI" or "TEACHER"
        defaultValue: "AI",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  Evaluation.associate = (models) => {
    Evaluation.belongsTo(models.Submission, { foreignKey: "submission_id", as: "submission" });
  };

  return Evaluation;
};
