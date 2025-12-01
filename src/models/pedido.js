"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Mesa);
      this.belongsTo(models.Cliente);
      this.belongsTo(models.Funcionario);
      this.hasMany(models.ProdutosPedido)
    }
  }
  Pedido.init(
    {
      data_hora: DataTypes.DATE,
      total: DataTypes.DOUBLE,
      status: DataTypes.STRING,
      mesaId: DataTypes.INTEGER,
      clienteId: DataTypes.INTEGER,
      funcionarioId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Pedido",
    }
  );
  return Pedido;
};
