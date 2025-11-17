"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pedidos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      data_hora: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      total: {
        type: Sequelize.DOUBLE,
      },
      status: {
        type: Sequelize.ENUM("aberto", "pago", "em preparo", "entregue"),
        allowNull: false,
        defaultValue: "aberto",
      },
      mesaId: {
        type: Sequelize.INTEGER,
        references: { model: "mesas", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      clienteId: {
        type: Sequelize.INTEGER,
        references: { model: "clientes", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      funcionarioId: {
        type: Sequelize.INTEGER,
        references: { model: "funcionarios", key: "id" },
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
    await queryInterface.dropTable("Pedidos");
  },
};
