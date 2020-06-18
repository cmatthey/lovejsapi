const tweet = require("../../services/tweet");

getSummary = (req, res) => {
  res.status(200).json({ message: "Not implemented" });
};

getReport = async (req, res) => {
  try {
    const data = await tweet.getReport(
      req.query.display_name,
      req.params.screen_name
    );
    if ("error" in data) {
      res.status(data.error.code).json(data.error.message);
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.log("Error in getReport ", error);
    return res.status(500).json({ message: "Unknown error" });
  }
};

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
    console.log("Error in getCount ", error);
    return res.status(500).json({ message: "Unknown error" });
  }
};

toCsv = async (req, res) => {
  try {
    const data = await tweet.toCsv(
      req.query.display_name,
      req.params.screen_name
    );
    if (data instanceof Object && "error" in data) {
      res.status(data.error.code).json(data.error.message);
    } else {
      res
        .status(200)
        .header("Content-Disposition", "attachment;filename=data.csv") //TODO
        .type("text/csv")
        .send(data);
    }
  } catch (error) {
    console.log("Error in toCsv ", error);
    return res.status(500).json({ message: "Unknown error" });
  }
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
