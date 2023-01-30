"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.carts, {
        foreignKey: "items_id",
      });
      this.belongsTo(models.category, {
        foreignKey: "category_id",
      });
    }
  }
  items.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      images: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "items",
    }
  );
  return items;
};
