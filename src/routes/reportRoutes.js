const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportConttroller");
const { authenticate, isAdmin} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Siswa
router.post("/create_report", authenticate, upload.single("foto"), reportController.createReport);
router.get("/my_reports", authenticate, reportController.getMyReports);
router.get("/detail_report/:id", authenticate, reportController.getMyReportDetail);
router.get("/my_dashboard", authenticate, reportController.getMyDashboard);
router.post("/replyComment", authenticate, reportController.replyComment);
router.put("/update_report/:id", authenticate, upload.single("foto"), reportController.updateMyReport);

// admin
router.get("/all_reports", authenticate, isAdmin, reportController.getAllReports);
router.get("/report_detail/:id", authenticate, isAdmin, reportController.getReportDetail);


module.exports = router;