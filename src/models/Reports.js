module.exports = (sequelize, DataTypes) => {
    const Reports = sequelize.define(
        "Reports",
        {
            id_report : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            judul : {
                type : DataTypes.STRING(150),
                allowNull : false,
                validate : {
                    notEmpty : false,
                },
            },
            deskripsi : {
                type : DataTypes.TEXT,
                allowNull : false,
            },
            foto : {
                type : DataTypes.TEXT,
                allowNull : false,
            },
            status : {
                type : DataTypes.ENUM("menunggu", "diproses", "selesai", "ditolak"),
                allowNull : false,
                defaultValue : "menunggu",
            },
            prioritas : {
                type : DataTypes.ENUM("rendah", "sedang", "tinggi"),
                allowNull : false,
                defaultValue : "sedang",
            },
            user_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            class_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            room_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            category_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
        },
        {
            modelName : "Reports",
            tableName : "reports",
            timestamps : true,
            paranoid : true,
        },
    );

    Reports.associate = (models) => {
        Reports.belongsTo(models.User, {
            foreignKey : "user_id",
            as : "user",
        });

        Reports.belongsTo(models.Class, {
            foreignKey : "class_id",
            as : "class",
        });

        Reports.belongsTo(models.Room, {
            foreignKey : "room_id",
            as : "room",
        });

        Reports.belongsTo(models.Categories, {
            foreignKey : "category_id",
            as : "category",
        });

        Reports.hasMany(models.Comments, {
            foreignKey : "report_id",
            as : "comments",
        });

        Reports.hasMany(models.Notifications, {
            foreignKey : "report_id",
            as : "notifications",
        });
    };
    return Reports;
}