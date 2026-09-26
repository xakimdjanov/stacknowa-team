module.exports = (sequelize, DataTypes) => {
  const Faculty = sequelize.define(
    "Faculty",
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

  Faculty.associate = (models) => {
    Faculty.belongsTo(models.University, { foreignKey: "university_id", as: "university" });
    Faculty.hasMany(models.Department, { foreignKey: "faculty_id", as: "departments" });
    Faculty.hasMany(models.User, { foreignKey: "faculty_id", as: "teachers" });
  };

  return Faculty;
};
