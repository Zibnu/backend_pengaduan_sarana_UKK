const { Reports, Categories, Room, Class, User, Notifications} = require("../models");

exports.createReport = async (req, res) => {
    try {
        const { judul, deskripsi, prioritas, room_id, category_id } = req.body;
        const userId = req.user.id_user;
        const classId = req.user.class_id

        if(!judul || !deskripsi || !prioritas || !room_id || !category_id) {
            return res.status(400).json({
                success : false,
                message : "Your Input Is Null",
            });
        }

        const room = await Room.findByPk(room_id);
        const category = await Categories.findByPk(category_id);
        if(!room) {
            return res.status(404).json({
                success : false,
                message : "Room not Found",
            });
        }

        if(!category) {
            return res.status(404).json({
                success : false,
                message : "Category Not Found",
            });
        }

        let foto = null;
        if(req.file) {
            foto = `${req.protocol}://${req.get("host")}/uploads/reports/${req.file.filename}`;
        }

        const report = await Reports.create({
            judul,
            deskripsi,
            foto,
            status : "menunggu",
            prioritas,
            user_id : userId,
            class_id : classId,
            room_id,
            category_id,
        });

        await Notifications.create({
            message : "Laporan Berhasil dikirim",
            is_read : false,
            user_id : userId,
            report_id : report.id_report,
        });

        return res.status(201).json({
            success : true,
            message : "Report Success Created",
            data : report,
        });
    } catch (error) {
        console.error("Create Report Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};