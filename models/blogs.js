module.exports = (sequelize, Sequelize) => {
  const Blogs = sequelize.define(
    "blogs",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
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

  Blogs.associate = ({ images, comments, blogs }) => {
    blogs.hasMany(comments, { foreignKey: "blog_id" });
    comments.belongsTo(blogs, { foreignKey: "blog_id" });
    images.belongsTo(blogs, { foreignKey: "blog_id" });
  };
  
  return Blogs;
};
