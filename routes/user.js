const users = require("../controllers/user.js");
const router = require("express").Router();

router.post("/", users.create); /* Create a new user */
router.post("/auth", users.authentication); /* login api */ 

module.exports = router;
