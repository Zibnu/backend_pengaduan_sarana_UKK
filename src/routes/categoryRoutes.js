const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authenticate , isAdmin } = require("../middleware/authMiddleware");

router.post("/create_category", authenticate, isAdmin, categoryController.createCategory);
router.get("/get_all_category", categoryController.getAllCategories);
router.get("/get_category/:id", categoryController.getCategoryById);
router.delete("/del_category/:id", authenticate, isAdmin, categoryController.deleteCategory);

module.exports = router;