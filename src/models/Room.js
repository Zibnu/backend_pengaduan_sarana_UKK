module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define(
        "Room",
        {
            id_room : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            nama_ruang : {
                type : DataTypes.STRING(100),
                allowNull : false,
                validate : {
                    notEmpty : true,
                },
            },
            tipe : {
                type : DataTypes.ENUM(
                    "kelas",
                    "lab",
                    "bengkel",
                    "ruang_guru",
                    "organisasi",
                    "lainnya"
                ),
                allowNull : false,
            },
        },
        {
            modelName : "Room",
            tableName : "rooms",
            timestamps : true,
            paranoid : true,
        }
    );

    Room.associate = (models) => {
        Room.hasMany(models.Reports, {
            foreignKey : "room_id",
            as : "reports",
        });
    };
    return Room;
};