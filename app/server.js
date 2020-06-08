const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const statusRouter = require("./routes/status-router");
// const db = require("../db"); //Not in use
// const Status = require("./models/status"); //Not in use

const app = express();
app.use(morgan("dev")); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// middleware to use for all requests // TODO: need to review
const router = express.Router();
router.use(function (req, res, next) {
  // do logging
  console.log("Something is happening.");
  next();
});

app.use("/api", statusRouter);

app.listen(port, () => console.log(`API server is started on port ${port}`));
