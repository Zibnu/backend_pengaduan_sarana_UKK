module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define(
        "Class",
        {
            id_class : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            nama_kelas : {
                type : DataTypes.STRING(50),
                allowNull : false,
                unique : true,
                validate : {
                    notEmpty : true,
                },
            },
            tingkat : {
                type : DataTypes.INTEGER,
                allowNull : false,
                validate : {
                    isIn : [[10, 11, 12]],
                },
            },
            jurusan : {
                type : DataTypes.ENUM("PPLG", "TO", "RPL", "PG", "TSM", "TOT"),
                allowNull : false,
            },
        },
        {
            modelName : "Class",
            tableName : "class",
            timestamps : true,
            paranoid : true,
        }
    );
    
    Class.associate = (models) => {
        Class.hasMany(models.User, {
            foreignKey : "class_id",
            as : "students",
        });
        Class.hasMany(models.Reports, {
            foreignKey : "class_id",
            as : "reports",
        });
    };
    return Class
}