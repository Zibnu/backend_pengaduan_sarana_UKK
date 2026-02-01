const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/comment_by_report/:report_id", authenticate, commentController.getCommentByReport);
router.put("/update_comment/:id", authenticate, commentController.updateComment);

module.exports = router;