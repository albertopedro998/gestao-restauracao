"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Caixas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dataAbertura: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dataFechamento: {
        type: Sequelize.DATE,
      },
      saldoInicial: {
        type: Sequelize.DOUBLE,
      },
      saldoFinal: {
        type: Sequelize.DOUBLE,
      },
      status: {
        type: Sequelize.ENUM("aberta", "fechada"),
        allowNull: false,
        defaultValue: "aberta",
      },
      funcionarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "funcionarios", key: "id" },
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
    await queryInterface.dropTable("Caixas");
  },
};
