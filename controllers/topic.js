// const db = require("../models");
// const Topics = db.topics;
const { createTopic, findAllTopices, findTopicById } = require("../service/topic");

/* create topic */
exports.create = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({ message: "Topic can not be empty!" });
      return;
    }

    const Topic = {
      topic_name: req.body.topic_name,
      created_by: req.user.user.id,
      updated_by: req.user.user.id,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    const data = await createTopic(Topic);

    if (data) {
      const res_data = {
        msg: `Topic created successfully.`,
        action: "add",
      };
      res.status(200).send(res_data);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Topic.",
    });
  }
};

/* Get all topics and pagination */
exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;

    const data = await findAllTopices(page, pageSize);

    if (data) {
      res.status(200).send(data);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Topics.",
    });
  }
};

/* Get topic by id */
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await findTopicById(id);

    if (data) {
      res.status(200).send(data);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Topics.",
    });
  }
};
