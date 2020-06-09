const express = require("express");
const StatusCtrl = require("../controllers/status-ctrl");
const router = express.Router();

router.get("/status", StatusCtrl.getSummary);
router.get("/status/:screen_name", StatusCtrl.getReport);
router.get("/status/:screen_name/count", StatusCtrl.getCount);
router.get("/status/:screen_name/csv", StatusCtrl.toCsv);
router.get("/status/:screen_name/gdocs", StatusCtrl.toGoogleDocs);

module.exports = router;
