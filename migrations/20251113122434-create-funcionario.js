"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Funcionarios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cargo: {
        type: Sequelize.ENUM(
          "Garçon",
          "Barconista",
          "Admin",
          "caixa",
          "Cozinheiro",
          "Normal"
        ),
        allowNull: false,
        defaultValue: "Normal",
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nif: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      foto: {
        type: Sequelize.STRING,
      },
      dtNascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Funcionarios");
  },
};
