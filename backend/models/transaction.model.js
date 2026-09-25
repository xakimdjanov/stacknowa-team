module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // inPAY order_id e.g. "1ff2f5a6d66f6e9c"
      },
      inpay_transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // inPAY ichki transaction_id
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false, // in UZS
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: true, // "click", "payme", "cardsystem"
      },
      status: {
        type: DataTypes.ENUM("pending", "success", "failed", "cancelled"),
        defaultValue: "pending",
      },
      pay_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      raw_webhook_data: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Transaction.belongsTo(models.Plan, { foreignKey: "plan_id", as: "plan" });
  };

  return Transaction;
};
