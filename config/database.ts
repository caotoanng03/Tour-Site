import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DATABASE_NAME, // database name
    process.env.DATABASE_USR,   // database usr name
    process.env.DATABASE_PASSWORD,     // database password
    {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        dialect: "mysql"
    });

sequelize.authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch(() => {
        console.log("Unable to connect database!");
    });

export default sequelize;
