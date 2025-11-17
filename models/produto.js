"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Cardapio, { foreignKey: "cardapioId" });
      this.belongsTo(models.Fornecedor);
      this.hasMany(models.MovimentoEstoque);
      this.hasMany(models.ProdutosPedido);
    }
  }
  Produto.init(
    {
      nome: DataTypes.STRING,
      precoVenda: DataTypes.FLOAT,
      custo: DataTypes.FLOAT,
      estoqueAtual: DataTypes.INTEGER,
      imagem: DataTypes.STRING,
      status: DataTypes.STRING,
      fornecedorId: DataTypes.INTEGER,
      cardapioId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Produto",
    }
  );
  return Produto;
};
