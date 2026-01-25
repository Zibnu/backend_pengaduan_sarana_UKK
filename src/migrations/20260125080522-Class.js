"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("class", {
      id_class: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_kelas: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      tingkat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[10, 11, 12]],
        },
      },
      jurusan: {
        type: Sequelize.ENUM("PPLG", "TO", "RPL", "PG", "TSM", "TOT"),
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
    await queryInterface.dropTable("class");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_class_jurusan";');
  },
};
