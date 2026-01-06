const bcrypt = require("bcryptjs");

("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Funcionario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Pedido);
      this.belongsTo(models.Empresa);
      this.belongsTo(models.User);
    }
  }
  Funcionario.init(
    {
      nome: DataTypes.STRING,
      cargo: DataTypes.STRING,
      senha: DataTypes.STRING,
      nif: DataTypes.STRING,
      foto: DataTypes.STRING,
      dtNascimento: DataTypes.DATE,
      status: DataTypes.STRING,
      empresaId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Funcionario",
    }
  );
  return Funcionario;
};
