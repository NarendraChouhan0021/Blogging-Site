const db = require("../models");
const User = db.users;
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const mg = require("nodemailer-mailgun-transport");

/* Create and save new user */
exports.create = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    /* check email existence */
    const is_email_exist = await User.findOne({
      where: { email: req.body.email },
    });
    if (is_email_exist) {
      res.status(409).send({
        message: "Email already exist!!",
        success: 0,
      });
      return;
    }

    /* Create a User */
    const user = {
      email: req.body.email,
      password: req.body.password,
      username: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
    };

    /* Save User in the database */
    let data = await User.create(user);

    if (data) {
      let res_data = {};
      const email = data.email;
      const mail_sent = await sendMail(`Welcome to the Blogging Website.`, email);

      if (mail_sent) {
        res_data = {
          msg: `User created successfully.`,
          action: "add",
          success: 1,
        };
      } else {
        res_data = {
          msg: `User Added Successfully.Unable to send email to user.`,
          action: "add",
          success: 1,
        };
      }

      res.status(200).send(res_data);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the user.",
    });
  }
};

/* Authenticate user credentials */
exports.authentication = async (req, res) => {
  try {
    if (req.body.email === "" || req.body.password === "") {
      res.status(400).send({
        message: "Content can not be empty!",
        success: 0,
      });
      return;
    }

    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (user) {
      const user_pass = req.body.password;
      const stored_pass = user.password;
      const is_valid_pwd = user_pass === stored_pass ? true : false;

      if (!is_valid_pwd) {
        res.status(404).send({
          message: "Invalid Credentials!",
          success: 0,
        });
        return;
      }

      const body = { id: user.id, };
      const token = jwt.sign({ user: body }, "Blogging?222At@");
      const data = { token: token, success: 1 };

      res.status(200).send(data);
    } else {
      res.status(404).send({
        message: "Invalid Credentials!",
        success: 0,
      });
      return;
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while user authentication.",
    });
  }
};


const sendMail = async (title, email) => {
  return new Promise((resolve, reject) => {
    const mailgunAuth = {
      auth: {
        api_key: "key-a65d852e41a887b7eb01aea2195d612e",
        domain: "mg.mycondopark.com",
      },
    };

    const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));

    const mailOptions = {
      from: "nikuchouhan4all@gmail.com",
      to: email,
      subject: "Credential For Blogpost",
      text: title,
    };

    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}