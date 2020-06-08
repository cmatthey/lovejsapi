const express = require("express");
const StatusCtrl = require("../controllers/status-ctrl");
const router = express.Router();

router.get("/status/:id", StatusCtrl.getStatus);
router.get("/status/:id/count", StatusCtrl.getCount);
router.get("/status/:id/csv", StatusCtrl.getCsv);

module.exports = router;
