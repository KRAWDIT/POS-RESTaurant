"use strict";
const { Model } = require("sequelize");
const items = require("./items");
module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.items, {
        foreignKey: "items_id",
      });
      this.belongsTo(models.users, {
        foreignKey: "users_id",
      });
    }
  }
  carts.init(
    {
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "carts",
    }
  );
  return carts;
};
