const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;
db.once("open", function () {
  console.log("DB connection alive");
});
module.exports = db;
