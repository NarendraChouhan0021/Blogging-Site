const express = require("express");
const morgan = require("morgan");
const models = require("./models");

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

/*  Connection with db. */
models.sequelize
  .sync({ force: false })
  .then(() =>
    app.listen(PORT, () =>
      console.log(message, "\nConnection has been established successfully.")
    )
  )
  .catch((err) => console.error("Unable to connect to the database:", err));

require("./startup/routes")(app);
