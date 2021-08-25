const index = require("../routes/index");
const user = require("../routes/user");
const jwt = require("jsonwebtoken");
const topic = require("../routes/topic");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, 'Blogging?222At@');

    if (!data) throw new Error();
    req.user = data;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("Not a valid user.");
  }
};

module.exports = (app) => {
  app.use("/", index);
  app.use("/api/v1/user", user);
  app.use("/api/v1/topic", auth, topic);

};
