const jwt = require("jsonwebtoken");
const { users } = require("../models");
const bcrypt = require("bcrypt");

const userCreate = async (body) => {
  console.log("body", body)
  try {
    let response = { is_email_exist: false, data: null };
    /* check email existence */
    const is_email_exist = await users.findOne({
      where: { email: body.email },
    });

    if (is_email_exist) {
      response["is_email_exist"] = true;
      return response;
    }

    const hash = await bcrypt.hashSync(body.password, 10);
    body["password"] = hash;

    /* Save User in the database */
    const data = await users.create(body);
    response["data"] = data;
    return response;
  } catch (error) {
    console.log("error", error)
    throw error;
  }
};

const userAuth = async (email, password) => {
  try {
    let response = { is_valid_cred: true, data: null };
    const user = await users.findOne({
      where: { email },
    });

    if (user) {
      const user_pass = password;
      const stored_pass = user.password;
      const is_valid_pwd = await bcrypt.compareSync(user_pass, stored_pass);

      if (!is_valid_pwd) {
        response["is_valid_cred"] = false;
        return response;
      }

      const body = { id: user.id };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
      const data = { token: token, success: 1 };
      response["data"] = data;
      return response;
    } else {
      response["is_valid_cred"] = false;
      return response;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { userCreate, userAuth };
