const { createComment, findByCommentId } = require("../service/comments");
const { validate } = require("../middleware");

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
      blog_id: req.body.blog_id
    };

    const validationIssue = validate(req, res, comment);

    if (validationIssue) {
      return res.status(500).send({
        message: validationIssue,
      });
    }

    comment.commented_by = req.user.user.id
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
    if (!id) {
      res.status(400).send({
        message: "Id can not be empty!",
        success: 0,
      });
      return;
    }
    
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
