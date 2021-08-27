const { blogs, comments, Images } = require("../models");

const createComment = async (comment) => {
  try {
    const data = await comments.create(comment);
    return data;
  } catch (error) {
    throw error;
  }
};

const findByCommentId = async (id) => {
  try {
    const data = await comments.findOne({ where: { id: id } });

    let propertyList = data;
    propertyList = propertyList["dataValues"];

    const blog = await blogs.findAll({
      where: { id: propertyList["blog_id"] },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    propertyList["blog"] = blog;

    const image = await Images.findAll({
      where: { blog_id: propertyList["blog_id"] },
      attributes: {
        exclude: ["createdAt", "updatedAt", "blog_id", "id"],
      },
    });
    propertyList["images"] = image;

    delete propertyList["blog_id"];

    return propertyList;
  } catch (error) {
    throw error;
  }
};

module.exports = { createComment, findByCommentId };
