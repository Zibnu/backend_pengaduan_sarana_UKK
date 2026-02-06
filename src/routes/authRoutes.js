    const express = require("express");
    const router = express.Router();
    const authController = require("../controllers/authController");
    const { authenticate } = require("../middleware/authMiddleware");

    router.post("/login", authController.login);
    router.post("/regis", authController.register);
    router.get("/myData", authenticate, authController.getMyData);

    module.exports = router;