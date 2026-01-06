"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Empresa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Funcionario);
      this.hasMany(models.Fornecedor);
      this.hasMany(models.Produto);
      this.hasMany(models.Mesa);
      this.hasMany(models.Pedido);
      this.hasMany(models.Caixa);
      this.hasMany(models.MovimentoEstoque);
      this.hasMany(models.Documento);
      this.hasMany(models.Pagamento);
      this.belongsTo(models.User);
    }
  }
  Empresa.init(
    {
      nome: DataTypes.STRING,
      site: DataTypes.STRING,
      logotipo: DataTypes.STRING,
      endereco: DataTypes.STRING,
      descricao: DataTypes.STRING,
      NIF: DataTypes.STRING,
      senha: DataTypes.STRING,
      userId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Empresa",
    }
  );
  return Empresa;
};
