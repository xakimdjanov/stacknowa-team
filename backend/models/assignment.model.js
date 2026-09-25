module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define(
    "Assignment",
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
      template_file_url: {
        type: DataTypes.STRING,
        allowNull: true, // S3 link or uploaded file URL
      },
      template_structure: {
        type: DataTypes.JSONB, // Sections: [ { id: "theme", title: "Mavzu", type: "rich_text", required: true }, ... ]
        allowNull: true,
      },
      rubric: {
        type: DataTypes.JSONB, // Criteria: [ { name: "Nazariy qism", max_score: 20 }, ... ]
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      max_score: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
      },
      allow_resubmission: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "closed"),
        defaultValue: "published",
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  Assignment.associate = (models) => {
    Assignment.belongsTo(models.Group, { foreignKey: "group_id", as: "group" });
    Assignment.hasMany(models.Submission, { foreignKey: "assignment_id", as: "submissions" });
  };

  return Assignment;
};
