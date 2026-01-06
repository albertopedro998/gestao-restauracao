"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Produto);
      this.belongsTo(models.Empresa);
    }
  }
  Categoria.init(
    {
      nome: DataTypes.STRING,
      empresaId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Categoria",
      tableName: { plural: "categorias", singular: "categoria" },
    }
  );
  return Categoria;
};
