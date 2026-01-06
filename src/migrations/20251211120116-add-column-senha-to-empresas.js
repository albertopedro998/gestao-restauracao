"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("empresas", "senha", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "123456",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("empresas", "senha");
  },
};
