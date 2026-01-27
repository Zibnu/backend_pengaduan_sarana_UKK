const { Op } = require("sequelize");
const { Categories } = require("../models");

exports.createCategory = async ( req, res ) => {
    try {
        const { nama_kategori } = req.body;

        if(!nama_kategori) {
            return res.status(400).json({
                success : false,
                message : "Your Input Is Null",
            });
        }

        const existingCategory = await Categories.findOne({ where : { nama_kategori } });
        if(!existingCategory) {
            return res.status(409).json({
                success : false,
                message : "Category Already Exists",
            });
        }

        const newCategory = await Categories.create({ nama_kategori });

        return res.status(201).json({
            success : true,
            message : "Create Category Success",
            data : newCategory,
        });
    } catch (error) {
        console.error("Create Category Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

exports.getAllCategories = async ( req, res ) => {
    try {
        const { page = 1, limit = 7, search, from, to} = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        // search by name
        if(search) {
            where.nama_kategori = {
                [Op.iLike] : `%${search}%`,
            };
        }

        // filter by date
        if( from && to) {
            where.createdAt = {
                [Op.between] : [new Date(from), new Date(to)],
            };
        }

        const { count, rows } = await Categories.findAndCountAll({
            where,
            limit : parseInt(limit),
            offset : parseInt(offset),
            order : [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success : true,
            message : "Get All Categories Success",
            data : rows,
            pagination : {
                total : count,
                page : parseInt(page),
                totalPage : Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error("Get All Categories Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Categories.findByPk(id);
        if(!category) {
            return res.status(404).json({
                success : false,
                message : "Category Not Found",
            });
        }

        return res.status(200).json({
            success : true,
            message : "Get Category Id Success",
            data : category,
        });
    } catch (error) {
        console.error("Get Category by Id Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

exports.deleteCategory = async ( req, res ) => {
    try {
        const { id } = req.params;

        const category = await Categories.findByPk(id);
        if(!category) {
            return res.status(404).json({
                success : false,
                message : "Category Not Found",
            });
        }

        await category.destroy();

        return res.status(200).json({
            success : true,
            message : "Delete Category Success",
        });
    } catch (error) {
        console.error("Delete Category Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};