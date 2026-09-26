const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("ADMIN", "UNIVERSITY_ADMIN", "TEACHER", "STUDENT"),
        allowNull: false,
        defaultValue: "STUDENT",
      },
      approval_status: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
        defaultValue: "APPROVED",
      },
      university_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      university_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      faculty_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      plan_type: {
        type: DataTypes.ENUM("FREE", "PRO"),
        defaultValue: "FREE",
      },
      plan_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  User.beforeSave(async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    // Teacher owns groups
    User.hasMany(models.Group, { foreignKey: "teacher_id", as: "created_groups" });
    // Student belongs to groups via GroupMember
    User.hasMany(models.GroupMember, { foreignKey: "student_id", as: "memberships" });
    // Student has submissions
    User.hasMany(models.Submission, { foreignKey: "student_id", as: "submissions" });
    // User has payment transactions
    User.hasMany(models.Transaction, { foreignKey: "user_id", as: "transactions" });
  };

  return User;
};
