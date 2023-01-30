"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: "users_id",
      });
      this.hasMany(models.transactions_details, {
        foreignKey: "transactions_id",
      });
      this.belongsTo(models.product, {
        foreignKey: "product_id",
      });
    }
  }
  transactions.init(
    {
      date: DataTypes.DATE,
      total_price: DataTypes.INTEGER,
      payment_proof: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "Waiting For Payment",
      },
    },
    {
      sequelize,
      modelName: "transactions",
    }
  );
  return transactions;
};
