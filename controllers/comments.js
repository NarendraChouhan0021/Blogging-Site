const db = require("../models");
const blogs = db.blogs;
const comments = db.comments;
const Images = db.images;

 /* add a new comment on post */
exports.create = async (req, res) => {
  try {
    if (!req.body || !Object.keys(req.body).length) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    const comment = {
      comment: req.body.comment,
      blog_id: req.body.blog_id,
      commented_by: req.user.user.id,
    };
    const data = await comments.create(comment);

    if (data) {
      const res_data = {
        msg: `comment is posted successfully.`,
        action: "add",
        success: 1,
      };

      res.status(200).send(res_data);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the comment.",
      success: 0,
    });
  }
};

/* fetch comment by id */
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
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

    if (propertyList) {
      res.send(propertyList);
    } else {
      res.send({});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error retrieving comment.",
    });
  }
};
