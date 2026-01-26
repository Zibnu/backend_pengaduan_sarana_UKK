    const jwt = require("jsonwebtoken");
    const { User } = require("../models");

    const SECRET = process.env.SECRET_KEYS;

    // verify token
    exports.authenticate = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if(!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success : false,
                    message : "No Token Provided",
                });
            };

            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(token, SECRET);

            const user = await User.findByPk(decoded.id_user);
            if(!user) {
                return res.status(404).json({
                    success : false,
                    message : "user not found",
                });
            };

            // Menyimpan info user ke req.user
            req.user = {
                id_user : user.id_user,
                nama : user.nama,
                role : user.role,
                class_id : user.class_id,
            };

            next();
        } catch (error) {
            if(error.name === "JsonWebTokenError"){
                return res.status(401).json({
                    success : false,
                    message : "Invalid Token",
                });
            }

            if(error.name === "TokenExpiredError"){
                return res.status(401).json({
                    success : false,
                    message : "Token Expired",
                });
            }

            return res.status(500).json({
                success : false,
                message : "Auth Error",
                error : error.message,
            });
        }
    };

    // isAdmin
    exports.isAdmin = async (req, res, next) => {
        if(req.user.role !== "admin"){
            return res.status(403).json({
                success : false,
                message : "Access Denied, admin Only",
            });
        }
        next();
    };

    // isSiswa
    exports.isSiswa = async (req, res, next) => {
        if(req.user.role !== "siswa"){
            return res.status(403).json({
                success : false,
                message : "Acces Denied, Siswa only",
            });
        }
        next();
    };