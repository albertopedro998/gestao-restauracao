"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Fornecedor extends Model {
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
  Fornecedor.init(
    {
      nome: DataTypes.STRING,
      telefone: DataTypes.STRING,
      email: DataTypes.STRING,
      nif: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Fornecedor",
      tableName: "fornecedores",
    }
  );
  return Fornecedor;
};
