const index = require("../routes/index");
const user = require("../routes/user");

module.exports = (app) => {
  app.use("/", index);
  app.use("/api/v1/user", user);
};
