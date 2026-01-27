const { Room } = require("../models");

const ALLOWED_TYPES = [ "kelas", "lab", "bengkel", "ruang_guru", "organisasi", "lainnya" ];
// 🔥🔥
exports.createRoom = async (req, res) => {
    try {
        const { nama_ruang, tipe } = req.body;

        if(!nama_ruang || !tipe){
            return res.status(400).json({
                success : false,
                message : "Your Input is NUll",
            });
        }

        if(!ALLOWED_TYPES.includes(tipe)){
            return res.status(403).json({
                success : false,
                message : `Allowed tipe : ${ALLOWED_TYPES.join(", ")}`,
            });
        }

        const newRoom = await Room.create({
            nama_ruang,
            tipe,
        });

        return res.status(201).json({
            success : true,
            message : "Create Room Success",
            data : newRoom,
        });
    } catch (error) {
        console.error("Create Room Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// 🔥🔥
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();

        return res.status(200).json({
            success : true,
            message : "Get All Room Success",
            data : rooms,
        });
    } catch (error) {
        console.error("Get All Rooms Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// 🔥🔥
exports.getRoomById = async ( req, res ) => {
    try {
        const { id } = req.params;

        const room = await Room.findByPk(id);
        if(!room){
            return res.status(404).json({
                success : false,
                message : "Room Not Found",
            });
        }

        return res.status(200).json({
            success : true,
            message : "Get Room By Id Success",
            data : room,
        });
    } catch (error) {
        console.error("Get Room By Id Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// 🔥🔥
exports.deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await Room.findByPk(id);
        if(!room){
            return res.status(404).json({
                success : false,
                message : "Room Not Found",
            });
        }

        await room.destroy();
        
        return res.status(200).json({
            success : true,
            message : "Delete Room Success",
        });
    } catch (error) {
        console.error("Delete Room Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};