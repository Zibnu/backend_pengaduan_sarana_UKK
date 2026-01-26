    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    const { User } = require("../models");

    const SECRET = process.env.SECRET_KEYS;
    const expired = "7d"

    // 🔥🔥
    exports.login = async (req, res) => {
        try {
            const { nis, password } = req.body;

            if(!nis || !password) {
                return res.status(401).json({
                    succces : false,
                    message : "NIS & PASSWORD Required!!!",
                });
            }

            const user = await User.findOne({ where : { nis } });
            if(!user){
                return res.status(404).json({
                    succces : false,
                    message : "User Not Found!!",
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(401).json({
                    succces : false,
                    massage : "Password is Wrong",
                });
            }

                const token = jwt.sign(
                    {
                        id_user : user.id_user,
                        role : user.role,
                        class_id : user.class_id,
                    },
                    SECRET,
                    { expiresIn : expired}
                );

                res.status(200).json({
                    succces : true,
                    message : "Login Success",
                    token,
                    user : {
                        id_user : user.id_user,
                        nama : user.nama,
                        nis : user.nis,
                        role : user.role,
                        class_id : user.class_id,
                    },
                });
        } catch (error) {
            console.error("LOGIN ERROR", error);
            return res.status(500).json({
                succces : false,
                message : "Internal Server ERROR",
                error : error.message,
            });
        }
    };

    // 🔥🔥
    exports.register = async (req, res) => {
        try {
            const { nama, nis, password, class_id} = req.body;

            if(!nama || !nis || !password || !class_id){
                return res.status(401).json({
                    succces : false,
                    message : "nama,nis, password and class_id required",
                });
            }

            const existingUser = await User.findOne({ where : { nis }});
            if(existingUser) {
                return res.status(409).json({
                    succces : false,
                    message : "Siswa Already Exists",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                nama,
                nis,
                password : hashedPassword,
                role : "siswa",
                class_id
            });

            const userResponse = {
                id_user : newUser.id_user,
                nama : newUser.nama,
                nis : newUser.nis,
                password : newUser.password,
                role : newUser.role,
                class : newUser.class_id
            }

            return res.status(200).json({
                success : true,
                message : "Register Success",
                data : userResponse,
            });
        } catch (error) {
            console.error("Register Error", error);
            return res.status(500).json({
                success : false,
                message : "Internal Server Error",
                error : error.message,
            });
        }
    };
