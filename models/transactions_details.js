"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transactions_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.transactions, {
        foreignKey: "transactions_id",
      });
    }
  }
  transactions_details.init(
    {
      product_category: DataTypes.STRING,
      item: DataTypes.STRING,
      price_per_item: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "transactions_details",
    }
  );
  return transactions_details;
};
