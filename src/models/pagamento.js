'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pagamento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Pedido)
      this.belongsTo(models.Caixa)
    }
  }
  Pagamento.init({
    metodo: DataTypes.STRING,
    valorPago: DataTypes.DOUBLE,
    troco: DataTypes.DOUBLE,
    dataPagamento: DataTypes.DATE,
    pedidoId: DataTypes.INTEGER,
    caixaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pagamento',
  });
  return Pagamento;
};