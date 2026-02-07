const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

router.post("/create_room", authenticate, isAdmin, roomController.createRoom);
router.get("/get_all_room", roomController.getAllRooms);
router.get("/get_room/:id", roomController.getRoomById);
router.delete("/del_room/:id", authenticate, isAdmin, roomController.deleteRoom);

module.exports = router;