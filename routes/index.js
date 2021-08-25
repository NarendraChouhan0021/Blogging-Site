const express = require("express");
const router = express.Router();
const users = require("../controllers/user.js");

router.get("/", function (req, res, next) {
  res.send("Express works fine.");
});

router.post("/api/v1/auth", users.authentication); /* User authentication */

module.exports = router;
