const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportConttroller");
const { authenticate } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/create_report", authenticate, upload.single("foto"), reportController.createReport);

module.exports = router;