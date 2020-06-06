const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
  display_name: String,
  screen_name: String,
  in_reply_to_screen_name: String,
  location: String,
  country: String,
  display_screen_name: String,
  link: String,
  text: String,
});

module.exports = mongoose.model("Status", StatusSchema);
