require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const models = require("./models");
const expressValidator = require("express-validator");

/* PORT assign */
const PORT = process.env.PORT || 8080;
const message = `Server is running on PORT:${PORT}.`;

/* Init express */
const app = express();

/* API monitoring */
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

/* express-validator */
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      let namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;
      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return msg;
    },
  })
);

/*  Connection with db. */
models.sequelize
  .sync()
  .then(() =>
    app.listen(PORT, () =>
      console.log(message, "\nConnection has been established successfully.")
    )
  )
  .catch((err) => console.error("Unable to connect to the database:", err));

require("./startup/routes")(app);
