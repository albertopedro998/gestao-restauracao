"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProdutosPedidos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      produtoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { key: "id", model: "produtos" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      pedidoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { key: "id", model: "pedidos" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      precoUnitario: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      empresaId: {
        type: Sequelize.INTEGER,
        references: {
          model: "empresas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("ProdutosPedidos");
  },
};
