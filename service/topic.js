const { topics } = require("../models");

const createTopic = async (topic) => {
  try {
    const data = await topics.create(topic);
    return data;
  } catch (error) {
    throw error;
  }
};

const findAllTopices = async (page, pageSize) => {
  try {
    let findQuery = {};

    if (page || pageSize) {
      findQuery = {
        ...findQuery,
        limit: parseInt(pageSize),
        offset: (parseInt(page) - 1) * parseInt(pageSize),
      };
    }

    const data = await topics.findAll(findQuery);
    return data;
  } catch (error) {
    throw error;
  }
};

const findTopicById = async(id) => {
    try {
        const data = await topics.findByPk(id);
        return data;
    } catch (error) {
        throw error;
    }
}

module.exports = { createTopic, findAllTopices, findTopicById };
