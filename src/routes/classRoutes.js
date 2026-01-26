const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const { authenticate, isAdmin} = require("../middleware/authMiddleware");

router.post("/add_class", authenticate, isAdmin, classController.createClass);
router.get("/get_allClass", authenticate, classController.getAllClass);

module.exports = router;