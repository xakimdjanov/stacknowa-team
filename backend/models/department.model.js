module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    "Department",
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
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      faculty_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      university_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  Department.associate = (models) => {
    Department.belongsTo(models.Faculty, { foreignKey: "faculty_id", as: "faculty" });
    Department.belongsTo(models.University, { foreignKey: "university_id", as: "university" });
    Department.hasMany(models.User, { foreignKey: "department_id", as: "teachers" });
  };

  return Department;
};
