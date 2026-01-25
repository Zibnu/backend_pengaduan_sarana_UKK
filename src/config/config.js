require("dotenv").config();

module.exports = {
    development : {
        username : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
        host : process.env.DB_HOST,
        dialect : process.env.DB_DIALECT,
        migrationStorageTableName : "migrations",
        migrationStorage : "sequelize",
        migrations : {
            path : "src/migrations",
            pattern : /\.js$/,
        },
        seederStorage : "sequelize",
        seederTableName : "seeders",
    },
    test : {
        username : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        host : process.env.DB_HOST,
        dialect : process.env.DB_DIALECT,
    },
    production : {
        username : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        host : process.env.DB_HOST,
        dialect : process.env.DB_DIALECT,
    },
};