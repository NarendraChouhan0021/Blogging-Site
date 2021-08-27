"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("images", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      main: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    return queryInterface.addColumn("images", "blog_id", {
      type: Sequelize.UUID,
      references: {
        model: "blogs",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("images");
    return queryInterface.removeColumn("comments", "blog_id");
  },
};
