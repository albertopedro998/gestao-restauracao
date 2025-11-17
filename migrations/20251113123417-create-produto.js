"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("produtos", {
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
      precoVenda: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      custo: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      estoqueAtual: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      imagem: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("disponivel", "indisponivel"),
        allowNull: false,
      },
      fornecedorId: {
        type: Sequelize.INTEGER,
        references: { model: "fornecedores", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      cardapioId: {
        type: Sequelize.INTEGER,
        references: { model: "cardapios", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
    await queryInterface.dropTable("produtos");
  },
};
