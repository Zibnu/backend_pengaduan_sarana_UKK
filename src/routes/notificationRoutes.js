const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/my_notif", authenticate, notificationController.getMyNotifications);
router.patch("/read/:id", authenticate, notificationController.markAsRead);


module.exports = router;