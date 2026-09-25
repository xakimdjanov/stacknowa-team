module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define(
    "GroupMember",
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
      joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["group_id", "student_id"],
        },
      ],
    }
  );

  GroupMember.associate = (models) => {
    GroupMember.belongsTo(models.Group, { foreignKey: "group_id", as: "group" });
    GroupMember.belongsTo(models.User, { foreignKey: "student_id", as: "student" });
  };

  return GroupMember;
};
