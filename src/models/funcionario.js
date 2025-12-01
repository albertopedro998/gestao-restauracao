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
    }

    async verifySession(password) {
      return await bcrypt.compare(password, this.senha);
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
    },
    {
      sequelize,
      modelName: "Funcionario",
    }
  );
  return Funcionario;
};
