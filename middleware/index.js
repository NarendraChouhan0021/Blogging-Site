const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(
      token,
      process.env.JWT_SECRET
    ); 
    const user = await User.findByPk(data.user.id);
    if (!user) throw new Error("user token is not valid");
    req.user = data;
    next();
  } catch (error) {
    res.status(400).send("Not a valid user. err:" + error);
  }
};

const validate = (req, res, required) => {
  for (let key in required) {
    console.log("key", key)
    if (key === "email") {
      let isEmpty = req.check(key, key + " must not be empty").not().isEmpty();
      if (!isEmpty) {
        req.assert("email", " Valid email required").isEmail();
      }
    } else {
      req.check(key, key + " must not be empty").not().isEmpty();
    }
  }
  return req.validationErrors();
};

module.exports = { auth, validate };
