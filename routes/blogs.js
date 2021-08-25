const Blog = require("../controllers/blogs");
const router = require("express").Router();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.array("image"), Blog.create); /*  Blog.create */
router.get("/", Blog.findAll); /* getting all blogs */

module.exports = router;
