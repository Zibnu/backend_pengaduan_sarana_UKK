    const express = require("express");
    const app = express();
    const path = require("path");
    require("dotenv").config();


    const sequelize = require("./src/config/db");

    app.use(express.json());
    app.use(express.urlencoded({extended : true}));

    // (async () => {
    //     try {
    //         await sequelize.authenticate();
    //         console.log("Connected SUCCESS");
    //     } catch (error) {
    //         console.error("Failed", error);
    //     }
    // })();

    app.get("/", (req, res) => {
        res.json({
            message : "Welcome"
        })
    })
    const PORT = process.env.PORT
    app.listen(PORT ,() => console.log("Server is Running"));