const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportConttroller");
const { authenticate, isAdmin} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/create_report", authenticate, upload.single("foto"), reportController.createReport);
router.get("/my_reports", authenticate, reportController.getMyReports);
router.get("/detail_report", authenticate, reportController.getMyReportDetail);

module.exports = router;