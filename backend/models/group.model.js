const { nanoid } = require("nanoid");

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course: {
        type: DataTypes.INTEGER,
        allowNull: false, // 1, 2, 3, 4
      },
      faculty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      academic_year: {
        type: DataTypes.STRING,
        allowNull: false, // e.g. '2025-2026'
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false, // 1 or 2
      },
      join_token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      access_code: {
        type: DataTypes.STRING,
        allowNull: true, // Optional password/code for entering group
      },
      allowed_email_domain: {
        type: DataTypes.STRING,
        allowNull: true, // e.g. 'tuit.uz'
      },
      status: {
        type: DataTypes.ENUM("active", "archived"),
        defaultValue: "active",
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  Group.beforeValidate((group) => {
    if (!group.join_token) {
      group.join_token = nanoid(12);
    }
  });

  Group.associate = (models) => {
    Group.belongsTo(models.User, { foreignKey: "teacher_id", as: "teacher" });
    Group.hasMany(models.GroupMember, { foreignKey: "group_id", as: "members" });
    Group.hasMany(models.Assignment, { foreignKey: "group_id", as: "assignments" });
  };

  return Group;
};
