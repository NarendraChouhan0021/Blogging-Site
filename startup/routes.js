const index = require("../routes/index");
const user = require("../routes/user");
const topic = require("../routes/topic");
const blog = require("../routes/blogs");
const comment = require("../routes/comments");
const { auth } = require("../middleware");

module.exports = (app) => {
  app.use("/", index);
  app.use("/api/v1/user", user);
  app.use("/api/v1/topic", auth, topic);
  app.use("/api/v1/blog", auth, blog);
  app.use("/api/v1/comment", auth, comment);
};
