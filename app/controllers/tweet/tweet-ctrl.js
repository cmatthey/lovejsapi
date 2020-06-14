// const express = require("express");
const tweet = require("../../services/tweet");

getSummary = (req, res) => {
  res.status(200).json({ message: "Not implemented" });
};

getReport = async (req, res) => {
  try {
    const data = await tweet.getTimeline(
      req.query.display_name,
      req.params.screen_name
    );
    if ("error" in data) {
      res.status(data.error.code).json(data.error.message);
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.log("--in getReport ", error);
    return res.status(500).json({ message: "Unknown error" });
  }
};

// TODO: Need to find out the correct API
getCount = async (req, res) => {
  try {
    const data = await tweet.getRetweetCount(
      req.query.display_name,
      req.params.screen_name
    );
    if ("error" in data) {
      res.status(data.error.code).json(data.error.message);
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.log("--in getCount ", error);
    return res.status(404).json({ error: error });
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
