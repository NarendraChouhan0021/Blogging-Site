const express = require("express");
const morgan = require("morgan");


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


/* Application router */
app.use("/api/v1", require("./routes"));

/* Testing router */
app.get("/test", (req, res) => res.send(message));

/* Restiction router */
app.all("*", (req, res) => res.status(404).send(`Access denied`));

app.listen(PORT, () =>
  console.log(message)
)
