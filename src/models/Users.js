module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id_user : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            nama : {
                type : DataTypes.STRING(100),
                allowNull : false,
                validate : {
                    notEmpty : true,
                },
            },
            nis : {
                type : DataTypes.STRING(20),
                allowNull : true,
                unique : true,
            },
            password : {
                type : DataTypes.STRING,
                allowNull : false,
            },
            role : {
                type : DataTypes.ENUM("siswa", "admin"),
                allowNull : false,
                defaultValue : "siswa",
            },
            class_id : {
                type : DataTypes.INTEGER,
                allowNull : true,
            },
        },
        {
            modelName : "User",
            tableName : "users",
            timestamps : true,
            paranoid : true,
        },
    );

    User.associate = (models) => {
        User.belongsTo(models.Class, {
            foreignKey : "class_id",
            as : "class",
        });

        User.hasMany(models.Report, {
            foreignKey : "user_id",
            as : "reports",
        });

        User.hasMany(models.Comment, {
            foreignKey : "user_id",
            as : "comments",
        });

        User.hasMany(models.Notifications, {
            foreignKey : "user_id",
            as : "notifications",
        });
    };
    return User;
};