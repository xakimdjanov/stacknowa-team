module.exports = (sequelize, DataTypes) => {
  const EventParticipant = sequelize.define(
    "EventParticipant",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      student_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_correct: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attendance_status: {
        type: DataTypes.ENUM("PRESENT", "ABSENT", "LATE"),
        defaultValue: "PRESENT",
      },
      answers: {
        type: DataTypes.JSON, // Record of answers submitted per question index
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  EventParticipant.associate = (models) => {
    EventParticipant.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
    EventParticipant.belongsTo(models.User, { foreignKey: "student_id", as: "student" });
  };

  return EventParticipant;
};
