"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProdutosPedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Produto);
      this.belongsTo(models.Pedido);
      this.belongsTo(models.Empresa);
    }
  }
  ProdutosPedido.init(
    {
      produtoId: DataTypes.INTEGER,
      pedidoId: DataTypes.INTEGER,
      quantidade: DataTypes.INTEGER,
      precoUnitario: DataTypes.FLOAT,
      subtotal: DataTypes.DOUBLE,
      empresaId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProdutosPedido",
    }
  );
  return ProdutosPedido;
};
