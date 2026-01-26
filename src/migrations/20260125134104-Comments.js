"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comments", {
      id_comments: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      report_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "reports",
          key : "id_report",
        },
        allowNull: false,
      },
      isi_komentar: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate : {
          notEmpty : true,
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "users",
          key : "id_user",
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
    await queryInterface.dropTable("comments");
  },
};
