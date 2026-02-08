const { Notifications, Reports, Comments } = require("../models");

// get notif by user 🔥🔥
exports.getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { page = 1, limit = 5} = req.query;

        const offset = (page - 1) * limit;

        const {count , rows } = await Notifications.findAndCountAll({
            where : { user_id : userId},
            distinct : true,
            include : [
                {
                    model : Reports,
                    as : "report",
                    attributes : ["id_report" , "judul" , "status", "prioritas"],
                    include : [
                        {
                            model : Comments,
                            as : "comments",
                            attributes : ["isi_komentar"],
                            separate : true,
                            order : [["createdAt", "DESC"]],
                        },
                    ],
                },
            ],
            order : [["createdAt", "DESC"]],
            limit : parseInt(limit),
            offset : parseInt(offset),
        });

        return res.status(200).json({
            success : true,
            message : "Get My Notifications Success",
            data : rows,
            pagination : {
                currentPage : parseInt(page),
                totalPage : Math.ceil(count / parseInt(limit)),
                totalItems : count,
                itemsPerPage : parseInt(limit),
            },
        });
    } catch (error) {
        console.error("Get My Notification Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userid = req.user.id_user;

        const notification = await Notifications.findOne({
            where : { id_notifications : id, user_id : userid },
        });

        if(!notification) {
            return res.status(404).json({
                success : false,
                message : "Notification Not Found",
            });
        }

        await notification.update({ is_read : true });

        return res.status(200).json({
            success : true,
            message : "Mark As Read Success",
            data : notification,
        });
    } catch (error) {
        console.error("Mark As Read Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};