// require("dotenv").config();
const mongoose = require("mongoose");

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  // .connect("mongodb://127.0.0.1:27017/test", { useNewUrlParser: true })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;
db.once("open", function () {
  console.log("DB connection alive");
});
module.exports = db;
