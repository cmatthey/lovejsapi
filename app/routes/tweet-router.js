const express = require("express");
const tweetCtrl = require("../controllers/tweet/tweet-ctrl");
const router = express.Router();

router.get("/tweet", tweetCtrl.getSummary);
router.get("/tweet/:screen_name", tweetCtrl.getReportAsync);
router.get("/tweet/:screen_name/count", tweetCtrl.getCount);
router.get("/tweet/:screen_name/csv", tweetCtrl.toCsv);
router.get("/tweet/:screen_name/gdocs", tweetCtrl.toGoogleDocs);

module.exports = router;
