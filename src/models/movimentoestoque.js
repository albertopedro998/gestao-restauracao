"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MovimentoEstoque extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Produto);
      this.belongsTo(models.Empresa);
    }
  }
  MovimentoEstoque.init(
    {
      tipo: DataTypes.STRING,
      quantidade: DataTypes.INTEGER,
      dataMovimento: DataTypes.DATE,
      observacao: DataTypes.TEXT,
      produtoId: DataTypes.INTEGER,
      empresaId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MovimentoEstoque",
    }
  );
  return MovimentoEstoque;
};
