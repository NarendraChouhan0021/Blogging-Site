const { createBlog, getAllBlogs } = require("../service/blogs");
const { validate } = require("../middleware");

/* Create new Blog */
exports.create = async (req, res) => {
  try {
    if (!req.body || !Object.keys(req.body).length) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    const blog = {
      title: req.body.title,
      description: req.body.description,
      topic_id: req.body.topic_id,
    };

    const validationIssue = validate(req, res, blog);
    
    if (validationIssue) {
      return res.status(500).send({
        message: validationIssue,
      });
    }

    blog.created_by = req.user.user.id;
    const data = await createBlog(blog);

    if (data) {
      const res_data = {
        msg: `Blog posted successfully.`,
        action: "add",
        success: 1,
      };
      res.status(200).send(res_data);
    }
  } catch (err) {
    res.status(500).send({
      message:
        "Some error occurred while creating the Blog. Topic Id is incorrect ",
      success: 0,
    });
  }
};

/* Get all post including comments */
exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;

    const data = await getAllBlogs(page, pageSize);

    if (data) {
      data.count = data.rows && data.rows.length ? data.rows.length : 0;
      res.status(200).send(data);
    }
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving blogs.",
    });
  }
};
