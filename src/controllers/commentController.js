const { User, Comments, Class, Notifications, Reports} = require("../models");

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

exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { isi_komentar } = req.body;
        const { id_user, role } = req.user;

        if(!isi_komentar) {
            return res.status(400).json({
                success : false,
                message : "Comment not null",
            });
        }

        const comment = await Comments.findOne({
            where : { id_comments : id, user_id : id_user},
            include : [
                {
                    model : Reports,
                    as : "report",
                    attributes : ["id_report", "user_id"],
                },
            ],
        });

        if(!comment) {
            return res.status(404).json({
                success : false,
                message : "Comment Not Found",
            });
        }

        await comment.update({ isi_komentar });

        // Logic Notifications
        let targetUserId;
        let message;

        // kondisi untuk siapa yang akan menerima notifikasi berdasarkan siapa yang membuat komentar
        if(role  === "admin") {
            targetUserId = comment.report.user_id;
            message = "Admin Update Comment";
        }else {
            const admin = await User.findOne({
                where : { role : "admin" },
                attributes : ["id_user"],
            });
            targetUserId = admin.id_user;
            message = "Siswa Memperbarui Komentar Pada Laporan";
        };

        await Notifications.create({
            user_id : targetUserId,
            report_id : comment.report.id_report,
            message,
            is_read : false,
        });

        return res.status(200).json({
            success : true,
            message : "Update Comment Success",
            data : comment,
        });
    } catch (error) {
        console.error("Update Comment Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};