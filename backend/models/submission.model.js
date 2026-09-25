module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define(
    "Submission",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      assignment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("draft", "submitted", "evaluating", "graded", "returned"),
        defaultValue: "draft",
      },
      content: {
        type: DataTypes.JSONB, // White-paper field responses: { theme: "...", theory: "...", practical: "...", code: "...", conclusion: "..." }
        allowNull: true,
      },
      attached_images: {
        type: DataTypes.JSONB, // Array of AWS S3 image URLs: [ "https://s3.../img1.png", ... ]
        defaultValue: [],
      },
      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      submitted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  Submission.associate = (models) => {
    Submission.belongsTo(models.Assignment, { foreignKey: "assignment_id", as: "assignment" });
    Submission.belongsTo(models.User, { foreignKey: "student_id", as: "student" });
    Submission.hasOne(models.Evaluation, { foreignKey: "submission_id", as: "evaluation" });
  };

  return Submission;
};
