const { User, Comments, Class } = require("../models");

// get Comment by report
exports.getCommentByReport = async (req, res) => {
    try {
        const { report_id } = req.params;

        const comment = await Comments.findAll({
            where : { report_id },
            include : [
                {
                    model : User,
                    as : "user",
                    attributes : ["id_user" , "nama"],
                    include : [
                        {
                            model : Class,
                            as : "class",
                            attributes : ["nama_kelas"],
                        },
                    ],
                },
            ],
            order : [["createdAt", "ASC"]],
        });

        return res.status(200).json({
            success : true,
            message : "Get Comment By Report Success",
            data : comment,
        });
    } catch (error) {
        console.error("Get Comment By Report Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};