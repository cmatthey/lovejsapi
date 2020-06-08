const express = require("express");
const StatusCtrl = require("../controllers/status-ctrl");
const router = express.Router();

router.get("/status/:screen_name", StatusCtrl.getStatus);
router.get("/status/:screen_name/count", StatusCtrl.getCount);
router.get("/status/:screen_name/csv", StatusCtrl.getCsv);

module.exports = router;
