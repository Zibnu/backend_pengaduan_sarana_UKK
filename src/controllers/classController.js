const { Class } = require("../models");
// tambahkan validasi atau keamanan ketika masukkan tingkat dan jurusan
exports.createClass = async (req, res) => {
    try {
        const { nama_kelas, tingkat, jurusan } = req.body;
        if(!nama_kelas || !tingkat || !jurusan){
            return res.status(401).json({
                success : false,
                message : "Your Input is Null",
            });
        }

        if(![10,11,12].includes(Number(tingkat))){
            return res.status(401).json({
                success : false,
                message : "Tingkat must be 10, 11, 12",
            });
        }

        const allowedJurusan = ["PPLG", "TO", "RPL", "PG", "TSM", "TOT"];
        if(!allowedJurusan.includes(jurusan)){
            return res.status(401).json({
                success : false,
                message : `Allowed jurusan : ${allowedJurusan.join(", ")}`,
            });
        }

        const existingClass = await Class.findOne({ 
            where : { nama_kelas : nama_kelas},
            paranoid : false,
        })
        if(existingClass) {
            if(existingClass.deletedAt) {
                await existingClass.restore();

                return res.status(200).json({
                    success : true,
                    message : "Restore Data Class Success",
                    data : existingClass,
                });
            }
            return res.status(403).json({
                success : false,
                message : "Nama Class Al Ready Exist"
            })
        }

        const newClass = await Class.create({
            nama_kelas,
            tingkat,
            jurusan,
        });

        return res.status(201).json({
            success : true,
            message : "Create Class Success",
            data : newClass,
        });
    } catch (error) {
        console.error("Create Class Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// 🔥🔥
exports.getAllClass = async (req, res) => {
    try {
        const classes = await Class.findAll();

        return res.status(200).json({
            success : true,
            message : "Get All Class Success",
            data : classes,
        });
    } catch (error) {
        console.error("Get All Class Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// 🔥🔥
exports.getClassById = async (req, res) => {
    try {
        const { id } = req.params;

        const classData = await Class.findByPk(id);

        if(!classData){
            return res.status(404).json({
                success : false,
                message : "Class Not Found",
            });
        }

        return res.status(200).json({
            success : true,
            message : "Get Class By Id Success",
            data : classData,
        });
    } catch (error) {
        console.error("Get Class By Id Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
}
// 🔥🔥
exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        const classData = await Class.findByPk(id);
        if(!classData) {
            return res.status(404).json({
                success : false,
                message : "Class Not Found",
            });
        }

        await classData.destroy();

        return res.status(200).json({
            success : true,
            message : "Delete Class Success",
        });
    } catch (error) {
        console.error("Delete Class Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
}