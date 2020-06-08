// BASE SETUP
// =============================================================================

// call the packages we need
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const twit = require("./controllers/twit");
const statusRouter = require("./routes/status-router");
const db = require("../db");

const app = express();
// configure app
app.use(morgan("dev")); // log requests to the console
// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000; // set our port

// Status models lives here
const Status = require("./models/status");

// ROUTES FOR OUR API
// =============================================================================

// create our router
const router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
  // do logging
  console.log("Something is happening.");
  next();
});

// REGISTER OUR ROUTES -------------------------------
app.use("/api", statusRouter);

// START THE SERVER
// =============================================================================
app.listen(port, () => console.log(`API server is started on port ${port}`));
