module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      game_pin: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM("DRAFT", "LOBBY", "ACTIVE", "FINISHED"),
        defaultValue: "LOBBY",
      },
      questions: {
        type: DataTypes.JSON, // Array of 40 questions with options [A, B, C, D] and correct choice index
        allowNull: true,
      },
      current_question_index: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      duration_per_question: {
        type: DataTypes.INTEGER,
        defaultValue: 20, // seconds
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      material_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: "teacher_id", as: "teacher" });
    Event.belongsTo(models.Group, { foreignKey: "group_id", as: "group" });
    Event.hasMany(models.EventParticipant, { foreignKey: "event_id", as: "participants" });
  };

  return Event;
};
