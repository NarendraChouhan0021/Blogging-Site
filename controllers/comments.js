// const db = require("../models");
// const blogs = db.blogs;
// const comments = db.comments;
// const Images = db.images;
const { createComment, findByCommentId } = require("../service/comments");

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
    const data = await createComment(comment);

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
    const data = await findByCommentId(id);
    if (data) {
      res.send(data);
    } else {
      res.send({});
    }
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving comment." + err,
    });
  }
};
