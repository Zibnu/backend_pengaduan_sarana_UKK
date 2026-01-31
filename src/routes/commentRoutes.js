const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/comment_by_report/:report_id", authenticate, commentController.getCommentByReport);

module.exports = router;