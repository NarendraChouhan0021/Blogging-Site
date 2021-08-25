const Topic = require("../controllers/topic");
const router = require("express").Router();

router.post("/", Topic.create); /* create topics */
router.get("/", Topic.findAll); /* getting all topics */
router.get("/:id", Topic.findOne); /* get topic by id */

module.exports = router;
