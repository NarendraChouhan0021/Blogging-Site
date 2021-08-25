module.exports = (sequelize, Sequelize) => {
  const Topics = sequelize.define(
    "topics",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      topic_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_by: {
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
  Topics.associate = ({ topics, blogs }) => {
    topics.hasMany(blogs, { foreignKey: "topic_id" });
    blogs.belongsTo(topics, { foreignKey: "topic_id" });
  };
  return Topics;
};
