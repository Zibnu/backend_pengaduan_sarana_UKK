"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rooms", {
      id_room: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_ruang: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      tipe: {
        type: Sequelize.ENUM(
          "kelas",
          "lab",
          "bengkel",
          "ruang_guru",
          "organisasi",
          "lainnya",
        ),
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
        type : Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rooms");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_rooms_tipe";');
  },
};
