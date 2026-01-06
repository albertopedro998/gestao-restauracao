"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pagamentos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      metodo: {
        type: Sequelize.ENUM("dinheiro", "cartão"),
        allowNull: false,
      },
      valorPago: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      troco: {
        type: Sequelize.DOUBLE,
      },
      dataPagamento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      pedidoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "pedidos", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      caixaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "caixas", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
    await queryInterface.dropTable("Pagamentos");
  },
};
