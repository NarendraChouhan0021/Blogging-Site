const index = require("../routes/index");
const user = require("../routes/user");
const jwt = require("jsonwebtoken");
const topic = require("../routes/topic");
const blog = require("../routes/blogs");
const comment = require("../routes/comments");
const db = require("../models");
const User = db.users;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, 'Blogging?222At@'); /* hardcoded the value for temp */
    const user = await User.findByPk(data.user.id)
    if (!user) throw new Error("user token is not valid");
    req.user = data;
    next();
  } catch (error) {
    res.status(400).send("Not a valid user. err:" + error);
  }
};

module.exports = (app) => {
  app.use("/", index);
  app.use("/api/v1/user", user);
  app.use("/api/v1/topic", auth, topic);
  app.use("/api/v1/blog", auth, blog);
  app.use("/api/v1/comment", auth, comment);
};
