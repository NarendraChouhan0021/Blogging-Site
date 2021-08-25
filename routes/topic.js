const Topic = require("../controllers/topic");

const router = require("express").Router();

// creating topics
router.post("/", Topic.create);

// getting all topics
router.get("/", Topic.findAll);

//get topic by id
router.get("/:id", Topic.findOne);

// // getting all blogs of topics
// router.get("/blog_id", Topic.getblogsoftopic);

module.exports = router;
