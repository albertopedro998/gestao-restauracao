'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProdutosPedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Produto)
      this.belongsTo(models.Pedido)
    }
  }
  ProdutosPedido.init({
    produtoId: DataTypes.INTEGER,
    pedidoId: DataTypes.INTEGER,
    quantidade: DataTypes.INTEGER,
    precoUnitario: DataTypes.FLOAT,
    subtotal: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'ProdutosPedido',
  });
  return ProdutosPedido;
};