// const express = require("express");
const twit = require("../../services/twit");
// import getTimeline from "../../services/twit_new_export"; //Not in use

getSummary = (req, res) => {
  res.status(200).json({ message: "Not implemented" });
};

getReport = async (req, res) => {
  let tweetsAndReplies = [];
  try {
    const data = await twit.getTimeline(req.params.screen_name);
    for (let [key, value] of Object.entries(data)) {
      let simplfiedTweet = Object();
      simplfiedTweet.display_name = req.query.display_name || "";
      simplfiedTweet.screen_name = value.user.screen_name;
      simplfiedTweet.link = `https://twitter.com/${req.params.screen_name}/status/${value.id_str}`;
      simplfiedTweet.retweet_count = value.retweet_count;
      simplfiedTweet.favorite_count = value.favorite_count;
      simplfiedTweet.created_at = value.created_at;
      simplfiedTweet.in_reply_to_screen_name =
        value.in_reply_to_screen_name || "";
      simplfiedTweet.lang = value.lang || "";
      simplfiedTweet.text = value.text || "";
      tweetsAndReplies.push(simplfiedTweet);
    }
    res.status(200).json(tweetsAndReplies);
  } catch (err) {
    console.log("--Http error in getReport" + err);
    return res.status(404).json({ message: err });
  }
};

// TODO: Need to find out the correct API
getCount = async (req, res) => {
  try {
    const data = await twit.getRetweetCount(req.params.screen_name);
    return res.status(200).json({ message: data });
  } catch (err) {
    console.log("--Http error in getCount" + err);
    return res.status(404).json({ message: err });
  }
};

toCsv = async (req, res) => {
  res.status(200).json({ message: "Not implemented" });
};

toGoogleDocs = async (req, res) => {
  res.status(200).json({ message: "Not implemented" });
};

module.exports = {
  getSummary,
  getReport,
  getCount,
  toCsv,
  toGoogleDocs,
};
