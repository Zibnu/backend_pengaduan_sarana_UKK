    const express = require("express");
    const app = express();
    const path = require("path");
    require("dotenv").config();


    const sequelize = require("./src/config/db");

    app.use(express.json());
    app.use(express.urlencoded({extended : true}));

    const authRoutes = require("./src/routes/authRoutes");
    const classRoutes = require("./src/routes/classRoutes");
    const roomRoutes = require("./src/routes/roomRoutes");
    const categoryRoutes = require("./src/routes/categoryRoutes");


    app.use("/api/auth", authRoutes);
    app.use("/api/class", classRoutes);
    app.use("/api/room", roomRoutes);
    app.use("/api/category", categoryRoutes);

    app.get("/", (req, res) => {
        res.json({
            message : "Welcome"
        })
    })
    const PORT = process.env.PORT
    app.listen(PORT ,() => console.log("Server is Running"));