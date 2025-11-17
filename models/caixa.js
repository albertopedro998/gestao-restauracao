'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Caixa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Funcionario)
    }
  }
  Caixa.init({
    dataAbertura: DataTypes.DATE,
    dataFechamento: DataTypes.DATE,
    saldoInicial: DataTypes.DOUBLE,
    saldoFinal: DataTypes.DOUBLE,
    status: DataTypes.STRING,
    funcionarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Caixa',
  });
  return Caixa;
};