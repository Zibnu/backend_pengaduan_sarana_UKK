const { Op } = require("sequelize");
const { Reports, Categories, Room, Class, User, Notifications, Comments} = require("../models");
// 🔥🔥
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
        const allowedPrioritas = ["rendah", "sedang", "tinggi"];
        if(!allowedPrioritas.includes(prioritas)) {
            return res.status(403).json({
                success : false,
                message : `Prioritas Allowed : ${allowedPrioritas}`,
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

        const admin = await User.findOne({ where : { role : "admin"}})

        await Notifications.create({
            message : "Laporan Baru Dari Siswa",
            is_read : false,
            user_id : admin.id_user,
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
// 🔥🔥 untuk mendapatkan semua data report
exports.getMyReports = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { status, page = 1, limit = 10} = req.query;

        const where = { user_id : userId};
        if(status) where.status = status;

        const offset = (page - 1) * limit;

        const { count, rows } = await Reports.findAndCountAll({
            where,
            include : [
                {
                    model : Room,
                    as : "room",
                    attributes : ["id_room", "nama_ruang", "tipe"],
                },
                {
                    model : Categories,
                    as : "category",
                    attributes : ["id_category", "nama_kategori"],
                },
            ],
            order : [["createdAt", "DESC"]],
            limit : parseInt(limit),
            offset : parseInt(offset),
        });

        return res.status(200).json({
            success : true,
            message : "Get My Report Success",
            data : rows,
            pagination : {
                currentPage : parseInt(page),
                totalPage : Math.ceil(count / parseInt(limit)),
                totalItems : count,
                itemsPerPage : parseInt(limit),
            },
        });
    } catch (error) {
        console.error("Get My Report Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// Digunakan untuk ketika di halaman detail report agar user bisa melihat detail reportnya
// 🔥🔥
exports.getMyReportDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id_user;

        const report = await Reports.findOne({
            where : {id_report : id, user_id : userId },
            include : [
                { 
                    model : Room,
                    as : "room",
                    attributes : ["id_room", "nama_ruang", "tipe"],
                },
                {
                    model : Categories,
                    as : "category",
                    attributes : ["id_category", "nama_kategori"],
                },
                {
                    model : Class,
                    as : "class",
                    attributes : ["id_class", "nama_kelas", "tingkat", "jurusan"],
                },
                {
                    model : Comments,
                    as : "comments",
                    attributes : ["id_comments", "isi_komentar", "report_id", "user_id", "createdAt", "updatedAt"],
                },
            ],
        });

        if(!report) {
            return res.status(4040).json({
                success : false,
                message : "Report Not Found",
            });
        }

        return res.status(200).json({
            success : true,
            message : "Get My Report Detail",
            data : report,
        });
    } catch (error) {
        console.error("Get My Report Detail Error", error);
        return res.status(500).json({
            success : false,
            message : "Intenal Server Error",
            error : error.message,
        });
    }
};
// 🔥🔥
exports.getMyDashboard = async (req, res) => {
    try {
        const userId = req.user.id_user;

        const total = await Reports.count({ where : {user_id : userId} });
        const menunggu = await Reports.count({ where : {user_id : userId, status : "menunggu"} });
        const diproses = await Reports.count({ where : { user_id : userId, status : "diproses"} });
        const selesai = await Reports.count({ where : {user_id : userId, status : "selesai"}});
        const ditolak = await Reports.count({ where : { user_id : userId, status : "ditolak"}});

        return res.status(200).json({
            success : true,
            message : "Get My Dashboard success",
            data : {
                totalReport : total,
                totalMenunggu : menunggu,
                totalDiProses : diproses,
                totalSelesai : selesai,
                totalDitolak : ditolak,
            },
        });
    } catch (error) {
        console.error("Get My Dashboard Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// Membalas komentar dari admin 🔥🔥
exports.replyComment = async ( req, res) => {
    try {
        const { report_id, isi_komentar } = req.body;
        const userId = req.user.id_user;

        if(!report_id || !isi_komentar) {
            return res.status(400).json({
                success : false,
                message : "Your input is null",
            });
        }

        const comment = await Comments.create({
            report_id,
            user_id : userId,
            isi_komentar,
        });

        const admin = await User.findOne({ where : { role : "admin"}});

        await Notifications.create({
            user_id : admin.id_user,
            report_id,
            message : "siswa Membalas Komentar",
            is_read : false,
        });

        return res.status(201).json({
            success : true,
            message : "Reply Comment Success",
            data : comment,
        });
    } catch (error) {
        console.error("Reply Comment Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

// untuk mengedit report sebelum status berubah dari menunggu ke status yang lain
// 🔥🔥
exports.updateMyReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, deskripsi, prioritas, room_id, category_id } = req.body;
        const userId = req.user.id_user;

        const report = await Reports.findOne({ where : { id_report : id, user_id : userId} });

        if(!report) {
            return res.status(404).json({
                success : false,
                message : "Report not found",
            });
        }

        if(report.status !== "menunggu") {
            return res.status(403).json({
                success : false,
                message : "Status bukan menunggu tidak bisa diubah",
            });
        }

        let foto = report.foto;
        if(req.file) {
            foto = `${req.protocol}://${req.get("host")}/uploads/reports/${req.file.filename}`;
        }

        await report.update({ judul, deskripsi, foto, prioritas, room_id, category_id});

        const admin = await User.findOne({ where : { role : "admin"} });

        await Notifications.create({
            user_id : admin.id_user,
            report_id : report.id_report,
            message : "Siswa memperbarui laporan",
            is_read : false,
        });

        return res.status(201).json({
            success : true,
            message : "Update Report Success",
            data : report
        })
    } catch (error) {
        console.error("Update My Report Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

// Admin Controller 
// 🔥🔥
exports.getAllReports = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, prioritas, search } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if(status) where.status = status;
        if(prioritas) where.prioritas = prioritas;
        if(search) {
            where.judul = { [Op.iLike] : `%${search}%`};
        }

        const {count, rows} = await Reports.findAndCountAll({
            where,
            include : [
                {
                    model : User,
                    as : "user",
                    attributes : ["id_user", "nama"],
                },
                {
                    model : Categories,
                    as : "category",
                    attributes : ["nama_kategori"],
                },
                {
                    model : Room,
                    as : "room",
                    attributes : ["nama_ruang"],
                },
            ],
            limit : parseInt(limit),
            offset,
            order : [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success : true,
            message : "Get All Reports Success",
            data : rows,
            pagination : {
                currentPage : parseInt(page),
                totalPages : Math.ceil(count / parseInt(limit)),
                totalItems : count,
                itemsPerPage : parseInt(limit),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// 🔥🔥
exports.getReportDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Reports.findByPk(id, {
            include : [
                {
                    model : User,
                    as : "user",
                    attributes : ["nama", "nis"],
                },
                {
                    model : Categories,
                    as : "category",
                    attributes : ["nama_kategori"],
                },
                {
                    model : Room,
                    as : "room",
                    attributes : ["nama_ruang"],
                },
                {
                    model : Class,
                    as : "class",
                    attributes : ["nama_kelas"]
                },
                {
                    model : Comments,
                    as : "comments",
                    attributes : ["isi_komentar"],
                    include : [
                        {
                            model : User,
                            as : "user",
                            attributes : ["nama", "nis"],
                        },
                    ],
                },
            ],
        });

        if(!report) {
            return res.status(404).json({
                success : false,
                message : "Report Not Found",
            });
        }

        return res.status(200).json({
            success : true,
            message : "Get Report Detail Success",
            data : report,
        });
    } catch (error) {
        console.error("Get Report Detail Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// update status report by admin 🔥🔥
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if(!status) {
            return res.status(400).json({
                success : false,
                message : "Your Input is Null",
            });
        }

        const report = await Reports.findByPk(id);
        if(!report) {
            return res.status(404).json({
                success : false,
                message : "Report Not Found",
            });
        }

        const allowedStatus = ["menunggu", "diproses", "selesai", "ditolak"];
        if(!allowedStatus.includes(status)) {
            return res.status(403).json({
                success : false,
                message : `Update Status Allowed : ${allowedStatus}`,
            });
        }

        await report.update({ status });

        await Notifications.create({
            user_id : report.user_id,
            report_id : report.id_report,
            message : `Status Report Update to be ${status}`,
            is_read : false,
        });

        return res.status(200).json({
            success : true,
            message : "Update Status Success",
            data : report,
        });
    } catch (error) {
        console.error("Update Status Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// update prioritas oleh admin 🔥🔥
exports.updatePriority = async (req, res) => {
    try {
        const { id } = req.params;
        const { prioritas } = req.body;

        if(!prioritas) {
            return res.status(400).json({
                success : false,
                message : "Your Input is Null",
            });
        }

        const report = await Reports.findByPk(id);
        if(!report) {
            return res.status(404).json({
                success : false,
                message : "Report Not Found",
            });
        }

        const allowedPrioritas = ["rendah", "sedang", "tinggi"];
        if(!allowedPrioritas.includes(prioritas)) {
            return res.status(403).json({
                success : false,
                message : `Prioritas allowed Update : ${allowedPrioritas}`,
            });
        }

        await report.update({ prioritas });

        const reportRes = {
            id_report : report.id_report,
            judul : report.judul,
            deskripsi : report.deskripsi,
            foto : report.foto,
            prioritas : report.prioritas,
            status : report.status,
        };

        return res.status(200).json({
            success : true,
            message : "Update Priority Success",
            data : reportRes,
        });
    } catch (error) {
        console.error("Update Priority Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// Create Comment admin 🔥🔥
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { isi_komentar } = req.body;
        const adminId = req.user.id_user;

        const report = await Reports.findByPk(id);
        if(!report) {
            return res.status(404).json({
                success : false,
                message : "Data Report Not Found",
            });
        }

        const comment = await Comments.create({
            report_id : id,
            isi_komentar,
            user_id : adminId,
        });

        await Notifications.create({
            user_id : report.user_id,
            report_id : id,
            message : "Admin telah membalas laporan",
            is_read : false,
        });

        return res.status(200).json({
            success : true,
            message : "Add Comment Success",
            data : comment,
        });
    } catch (error) {
        console.error(" Add Comment Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// get statistik report by admin 🔥🔥
exports.getDashboardStats = async (req, res) => {
    try {
        const total = await Reports.count();
        const menunggu = await Reports.count({ where : { status : "menunggu" }});
        const diproses = await Reports.count({ where : { status : "diproses" }});
        const selesai = await Reports.count({ where : { status : "selesai" }});
        const ditolak = await Reports.count({ where : { status : "ditolak" }});

        return res.status(200).json({
            success : true,
            message : "Get Dashboard Statistic Success",
            data : {
                total,
                menunggu,
                diproses,
                selesai,
                ditolak,
            },
        });
    } catch (error) {
        console.error("Get Dashboard Statistic Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

exports.exportReportPdf = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}