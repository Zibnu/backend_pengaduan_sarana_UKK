module.exports = (sequelize, DataTypes) => {
    const Notifications = sequelize.define(
        "Notifications",
        {
            id_notifications : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            message : {
                type : DataTypes.STRING(255),
                allowNull : false,
            },
            is_read : {
                type : DataTypes.BOOLEAN,
                allowNull : false,
                defaultValue : false,
            },
            user_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            report_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
        },
        {
            modelName : "Notifications",
            tableName : "notifications",
            timestamps : true,
            paranoid : true,
        },
    );
    Notifications.associate = (models) => {
        Notifications.belongsTo(models.User, {
            foreignKey : "user_id",
            as : "user",
        });
        Notifications.belongsTo(models.Reports, {
            foreignKey : "report_id",
            as : "report",
        });
    };
    return Notifications;
}