// const express = require("express");
const twit = require("../../services/twit");
// import getTimeline from "../../services/twit_new_export"; //Not in use

getSummary = (req, res) => {
  res.status(200).json({ message: "Not implemented" });
};

getReport = async (req, res) => {
  try {
    const data = await twit.getTimeline(
      req.query.display_name,
      req.params.screen_name
    );
    res.status(200).json(data);
  } catch (error) {
    console.log("--Http error in getReport " + error);
    return res.status(404).json({ error: error });
  }
};

// TODO: Need to find out the correct API
getCount = async (req, res) => {
  try {
    const data = await twit.getRetweetCount(
      req.query.display_name,
      req.params.screen_name
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log("--Http error in getCount " + error);
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
