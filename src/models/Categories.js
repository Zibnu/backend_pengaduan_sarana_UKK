module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define(
        "Categories",
        {
            id_category : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            nama_kategori : {
                type : DataTypes.STRING(100),
                allowNull : false,
                unique : true,
                validate : {
                    notEmpty : true,
                },
            },
        },
        {
            modelName : "Categories",
            tableName : "categories",
            timestamps : true,
            paranoid : true,
        },
    );

    Categories.associate = (models) => {
        Categories.hasMany(models.Report, {
            foreignKey : "category_id",
            as : "reports",
        });
    };
    return Categories;
};