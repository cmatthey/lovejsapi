const express = require("express");
const get_tweet = require("../controllers/get_tweet");

getStatus = (req, res) => {
  get_tweet.get_timeline(req.params.id, function (err, status) {
    if (err) res.send(err);
    res.status(200).json(status);
  });
};

getCount = (req, res) => {
  get_tweet.get_retweet_count(req.params.id, function (err, status) {
    if (err) res.send(err);
    res.status(200).json(status);
  });
};

getCsv = (req, res) => {
  get_tweet.get_timeline_in_csv(req.params.id, function (err, status) {
    if (err) res.send(err);
    res.status(200).json(status);
  });
};

module.exports = {
  getStatus,
  getCount,
  getCsv,
};
