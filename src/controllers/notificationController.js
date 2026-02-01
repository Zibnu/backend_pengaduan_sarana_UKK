const { Notifications, Reports } = require("../models");

// get notif by user 🔥🔥
exports.getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id_user;

        const notifications = await Notifications.findAll({
            where : { user_id : userId},
            include : [
                {
                    model : Reports,
                    as : "report",
                    attributes : ["id_report" , "judul" , "status"],
                },
            ],
            order : [["createdAt", "DESC"]]
        });

        return res.status(200).json({
            success : true,
            message : "Get My Notifications Success",
            data : notifications,
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