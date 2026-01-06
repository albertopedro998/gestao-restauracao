"use strict";
const bcrypt = require('bcryptjs');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Empresa);
      this.hasMany(models.Funcionario);
    }
    async verifySession(password) {
      return await bcrypt.compare(password, this.senha);
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      senha: DataTypes.STRING,
      username: DataTypes.STRING,
      NIF: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
