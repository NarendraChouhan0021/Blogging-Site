const db = require("../models");
const blogs = db.blogs;
const comments = db.comments;
const topic = db.topics;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;
const Images = db.images;

/* Create new Blog */
exports.create = async (req, res) => {
  try {
    if (!req.body || !Object.keys(req.body).length) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    const images = [];
    const blog = {
      title: req.body.title,
      description: req.body.description,
      topic_id: req.body.topic_id,
      created_by: req.user.user.id,
    };

    /*  Save blog in the database */
    const { dataValues } = await blogs.create(blog);
    if (req.files) {
      for (let file of req.files) {
        images.push({ main: file.path, blog_id: dataValues.id });
      }
      await Images.bulkCreate(images);
    }

    if (dataValues) {
      const res_data = {
        msg: `Blog posted successfully.`,
        action: "add",
        success: 1,
      };
      res.status(200).send(res_data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Blog.",
      success: 0,
    });
  }
};

/* Get all post including comments */
exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    console.log("pageSize", pageSize)
    console.log("page", page)

    let findQuery = {};
    const collectCommects = [];

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
        data.rows[i] = data.rows[i]["dataValues"];
        const topices = await topic.findOne({
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

        const image = await Images.findAll({
          where: { blog_id: data.rows[i]["id"] },
          attributes: {
            exclude: ["createdAt", "updatedAt", "blog_id", "id"],
          },
        });

        data.rows[i]["images"] = image;
        for (let j in comment) {
          console.log("comment[j]", comment[j]["dataValues"]);
          collectCommects.push({
            ...comment[j]["dataValues"],
          });
        }
        data.rows[i]["comments"] = collectCommects;
      }
    }

    if (data) {
      data.count = data.rows && data.rows.length ? data.rows.length : 0
      res.status(200).send(data);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving blogs.",
    });
  }
};
