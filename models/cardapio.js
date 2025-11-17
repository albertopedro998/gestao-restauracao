"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cardapio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Produto);
    }
  }
  Cardapio.init(
    {
      nome: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Cardapio",
    }
  );
  return Cardapio;
};
