const express = require("express");
const twit = require("../../services/twit");
// import getTimeline from "../../services/twit_new_export"; //Not in use

getSummary = (req, res) => {
  res.status(200).json({ message: "Not implemented" });
};

getReport = (req, res) => {
  twit.getTimeline(req.params.screen_name, function (err, data) {
    let tweetsAndReplies = [];
    console.log("Number of tweets or replies ", data.length);
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
    if (err) res.send(err);
    res.status(200).json(tweetsAndReplies);
  });
};

getReportAsync = async (req, res) => {
  try {
    await twit.getTimelineAxio2(req.params.screen_name);
  } catch (err) {
    console.log(`--Http error in getReportAsync ${err}`);
    return res.status(500).json({ message: err });
  }
  // try {
  //   [err, data, response] = await twit.getTimelineAsync(req.params.screen_name);
  //   // console.log(`--${response}--`, Object.prototype.toString.call(response));
  //   // console.log(`--${data}--`, Object.prototype.toString.call(data));
  //   res.status(200).json({ message: "not yet implemented" });
  // } catch (err) {
  //   console.log(`--Http error in getReportAsync ${err}`);
  //   return res.status(404).json({ message: err });
  // }
};

// TODO: Need to find out the correct API
getCount = (req, res) => {
  twit.getRetweetCount(req.params.screen_name, function (err, status) {
    if (err) res.send(err);
    res.status(200).json(status);
  });
};

toCsv = (req, res) => {
  res.status(200).json({ message: "Not implemented" });
};

toGoogleDocs = (req, res) => {
  res.status(200).json({ message: "Not implemented" });
};

module.exports = {
  getSummary,
  getReport,
  getReportAsync,
  getCount,
  toCsv,
  toGoogleDocs,
};
