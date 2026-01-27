const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

router.post("/create_room", authenticate, isAdmin, roomController.createRoom);
router.get("/get_all_room", authenticate, roomController.getAllRooms);
router.get("/get_room/:id", authenticate, roomController.getRoomById);
router.delete("/del_room/:id", authenticate, isAdmin, roomController.deleteRoom);

module.exports = router;