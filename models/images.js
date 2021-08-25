module.exports = (sequelize, Sequelize) => {
  const images = sequelize.define(
    "images",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      main: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "images",
      timestamps: true,
    }
  );

  return images;
};
