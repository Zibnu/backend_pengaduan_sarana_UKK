module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define(
        "Comments",
        {
            id_comments : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            report_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            isi_komentar : {
                type : DataTypes.TEXT,
                allowNull : false,
                validate : {
                    notEmpty : true,
                },
            },
            user_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
        },
        {
            modelName : "Comments",
            tableName : "comments",
            timestamps : true,
            paranoid : true,
        },
    );
    Comments.associate = (models) => {
        Comments.belongsTo(models.Reports, {
            foreignKey : "report_id",
            as : "report",
        });

        Comments.belongsTo(models.Users, {
            foreignKey : "user_id",
            as : "user",
        });
    };
    return Comments;
};