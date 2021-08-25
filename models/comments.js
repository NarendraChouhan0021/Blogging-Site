module.exports = (sequelize, Sequelize) => {
  const Comments = sequelize.define(
    "comments",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      commented_by: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: true,
        field: "created_at",
        type: "TIMESTAMP",
      },
      updatedAt: {
        allowNull: true,
        field: "updated_at",
        type: "TIMESTAMP",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
  return Comments;
};
