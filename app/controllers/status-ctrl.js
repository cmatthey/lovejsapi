const express = require("express");
const twit = require("./twit");

getStatus = (req, res) => {
  twit.get_timeline(req.params.id, function (err, status) {
    if (err) res.send(err);
    res.status(200).json(status);
  });
};

getCount = (req, res) => {
  twit.get_retweet_count(req.params.id, function (err, status) {
    if (err) res.send(err);
    res.status(200).json(status);
  });
};

getCsv = (req, res) => {
  twit.get_timeline_in_csv(req.params.id, function (err, status) {
    if (err) res.send(err);
    res.status(200).json(status);
  });
};

module.exports = {
  getStatus,
  getCount,
  getCsv,
};
