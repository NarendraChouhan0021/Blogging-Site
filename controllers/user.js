const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const { userCreate, userAuth } = require("../service/user");
const { validate } = require("../middleware");

/* Create and save new user */
exports.create = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    /* Create a User */
    const user = {
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
    };

    const validationIssue = validate(req, res, user);
    console.log("validationIssue", validationIssue)
    if (validationIssue) {
      return res.status(500).send({
        message: validationIssue,
      });
    }

    const { is_email_exist, data } = await userCreate(user);

    if (is_email_exist) {
      return res.status(409).send({
        message: "Email already exist!!",
        success: 0,
      });
    }

    if (data) {
      let res_data = {};
      const mail_sent = await sendMail(
        `Welcome to the Blogging Website.`,
        data.email
      );

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
    const email = req.body.email;
    const password = req.body.password;
    if (email === "" || password === "") {
      res.status(400).send({
        message: "Content can not be empty!",
        success: 0,
      });
      return;
    }
    const { is_valid_cred, data } = await userAuth(email, password);

    if (!is_valid_cred) {
      return res.status(404).send({
        message: "Invalid Credentials!",
        success: 0,
      });
    }

    return res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while user authentication.",
    });
  }
};

const sendMail = async (title, email) => {
  return new Promise((resolve, reject) => {
    console.log("process.env.DEV_MAIL_API_KEY", process.env.DEV_MAIL_API_KEY)
    const mailgunAuth = {
      auth: {
        api_key: process.env.DEV_MAIL_API_KEY,
        domain: process.env.DEV_MAIL_DOMAIN,
      },
    };

    const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));

    const mailOptions = {
      from: process.env.DEV_FROM_EMAIL,
      to: email,
      subject: "Welcome to Blogging Site",
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
};
