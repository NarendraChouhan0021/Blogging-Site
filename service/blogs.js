const { comments, topics, images, blogs, Sequelize } = require("../models");
// const Op = Sequelize.Op;

const createBlog = async (data) => {
  const images = [];
  try {
    /*  Save blog in the database */
    const { dataValues } = await blogs.create(data);
    if (data.files) {
      for (let file of data.files) {
        images.push({ main: file.path, blog_id: dataValues.id });
      }
      await images.bulkCreate(images);
    }
    return dataValues;
  } catch (error) {
    console.log(":error", error)
    throw error;
  }
};

const getAllBlogs = async (page, pageSize) => {
  try {
    let findQuery = {};

    if (page && pageSize) {
      findQuery = {
        ...findQuery,
        limit: parseInt(pageSize),
        offset: (parseInt(page) - 1) * parseInt(pageSize),
      };
    }

    const data = await blogs.findAndCountAll(findQuery);

    if (data && data.rows) {
      for (let i in data.rows) {
        const collectCommects = [];
        data.rows[i] = data.rows[i]["dataValues"];
        const topices = await topics.findOne({
          where: { id: data.rows[i]["topic_id"] },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        delete data.rows[i]["topic_id"];
        data.rows[i]["topic"] = topices["dataValues"];

        const comment = await comments.findAll({
          where: { blog_id: data.rows[i]["id"] },
          attributes: {
            exclude: ["createdAt", "updatedAt", "blog_id"],
          },
        });

        const image = await images.findAll({
          where: { blog_id: data.rows[i]["id"] },
          attributes: {
            exclude: ["createdAt", "updatedAt", "blog_id", "id"],
          },
        });

        data.rows[i]["images"] = image;
        for (let j in comment) {
          collectCommects.push({
            ...comment[j]["dataValues"],
          });
        }
        data.rows[i]["comments"] = collectCommects;
      }
    }

    return data;
  } catch (error) {
    console.log("err", error)
    throw error;
  }
};

module.exports = { createBlog, getAllBlogs };
