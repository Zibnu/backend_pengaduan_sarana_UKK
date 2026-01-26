"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
      id_notifications: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "users",
          key : "id_user",
        },
        allowNull: false,
      },
      report_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "reports",
          key : "id_report",
        },
        allowNull: false,
      },
      createdAt : {
        type : Sequelize.DATE,
        allowNull : false,
      },
      updatedAt : {
        type : Sequelize.DATE,
        allowNull : false,
      },
      deletedAt : {
        type : Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notifications");
  },
};
