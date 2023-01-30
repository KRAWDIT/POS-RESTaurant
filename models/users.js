"use strict";
const { UUIDV4 } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transactions, {
        foreignKey: "users_id",
      });
      this.hasMany(models.carts, {
        foreignKey: "users_id",
      });
    }
  }
  users.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "Username Already in Use",
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: { msg: "Email Not Valid" },
        },
        unique: true,
      },
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      access: {
        type: DataTypes.STRING,
        defaultValue: "enable",
      },
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
