const Comments = require("../controllers/comments");
const router = require("express").Router();

router.post("/", Comments.create); /* add comment on post */
router.get("/:id", Comments.findOne); /* fetch  particular comment */

module.exports = router;