module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PRESENT", "ABSENT", "LATE", "EXCUSED"),
        defaultValue: "PRESENT",
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["group_id", "student_id", "date"],
        },
      ],
    }
  );

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Group, { foreignKey: "group_id", as: "group" });
    Attendance.belongsTo(models.User, { foreignKey: "student_id", as: "student" });
  };

  return Attendance;
};
