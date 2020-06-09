const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  display_name: String,
  screen_name: String,
  link: String,
  retweet_count: Int,
  favorite_count: Int,
  created_at: String,
  in_reply_to_screen_name: String,
  text: String,
});

module.exports = mongoose.model("Status", TweetSchema);
