"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reports", {
      id_report: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      judul: {
        type: Sequelize.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: false,
        },
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      foto: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("menunggu", "diproses", "selesai", "ditolak"),
        allowNull: false,
        defaultValue: "menunggu",
      },
      prioritas: {
        type: Sequelize.ENUM("rendah", "sedang", "tinggi"),
        allowNull: false,
        defaultValue: "sedang",
      },
      user_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "users",
          key : "id_user",
        },
        allowNull: false,
      },
      class_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "class",
          key : "id_class",
        },
        allowNull: false,
      },
      room_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "rooms",
          key : "id_room",
        },
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "categories",
          key : "id_category",
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
    await queryInterface.dropTable("reports");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_reports_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_reports_prioritas";');
  },
};
