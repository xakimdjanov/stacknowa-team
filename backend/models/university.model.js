module.exports = (sequelize, DataTypes) => {
  const University = sequelize.define(
    "University",
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
      },
      unique_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE", "DELETED"),
        defaultValue: "ACTIVE",
      },
      plan_name: {
        type: DataTypes.STRING,
        defaultValue: "ENTERPRISE_PRO",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  University.associate = (models) => {
    University.hasMany(models.Faculty, { foreignKey: "university_id", as: "faculties" });
    University.hasMany(models.Department, { foreignKey: "university_id", as: "departments" });
    University.hasMany(models.User, { foreignKey: "university_id", as: "users" });
  };

  return University;
};
