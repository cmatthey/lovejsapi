// BASE SETUP
// =============================================================================

// call the packages we need
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const get_tweet = require("./get_tweet");

const app = express();
// configure app
app.use(morgan("dev")); // log requests to the console
// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000; // set our port

// DATABASE SETUP
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/test"); // connect to our database

// Handle the connection event
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("DB connection alive");
});

// Status models lives here
const Status = require("./app/models/status");

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

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get("/", function (req, res) {
  res.json({ message: "hooray! welcome to our api!" });
});

// on routes that end in /status
// ----------------------------------------------------
router
  .route("/status")

  // create a status (accessed at POST http://localhost:3000/status)
  .post(function (req, res) {
    const status = new Status(); // create a new instance of the Status model
    status.display_name = req.body.display_name; // set the status name (comes from the request)
    status.screen_name = req.body.screen_name; // set the status name (comes from the request)

    status.save(function (err) {
      if (err) res.send(err);

      res.json({ message: "Status created!" });
    });
  });

// on routes that end in /status/:status_id
// ----------------------------------------------------
router
  .route("/status/:status_id")

  // get the status with that id
  .get(function (req, res) {
    get_tweet.get_timeline(req.params.status_id, function (err, status) {
      if (err) res.send(err);
      res.json(status);
    });
  });

// REGISTER OUR ROUTES -------------------------------
app.use("/api", router);

// START THE SERVER
// =============================================================================
app.listen(port, () => console.log(`API server is started on port ${port}`));
