const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user.model")(sequelize, Sequelize.DataTypes);
const Group = require("./group.model")(sequelize, Sequelize.DataTypes);
const GroupMember = require("./groupMember.model")(sequelize, Sequelize.DataTypes);
const Attendance = require("./attendance.model")(sequelize, Sequelize.DataTypes);
const Assignment = require("./assignment.model")(sequelize, Sequelize.DataTypes);
const Submission = require("./submission.model")(sequelize, Sequelize.DataTypes);
const Evaluation = require("./evaluation.model")(sequelize, Sequelize.DataTypes);
const Plan = require("./plan.model")(sequelize, Sequelize.DataTypes);
const Transaction = require("./transaction.model")(sequelize, Sequelize.DataTypes);

const University = require("./university.model")(sequelize, Sequelize.DataTypes);
const Faculty = require("./faculty.model")(sequelize, Sequelize.DataTypes);
const Department = require("./department.model")(sequelize, Sequelize.DataTypes);
const Event = require("./event.model")(sequelize, Sequelize.DataTypes);
const EventParticipant = require("./eventParticipant.model")(sequelize, Sequelize.DataTypes);

const db = {
  User,
  Group,
  GroupMember,
  Attendance,
  Assignment,
  Submission,
  Evaluation,
  Plan,
  Transaction,
  University,
  Faculty,
  Department,
  Event,
  EventParticipant,
  sequelize,
  Sequelize,
};

// Model assotsiatsiyalarini o'rnatish
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
