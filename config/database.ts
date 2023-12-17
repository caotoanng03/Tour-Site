import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize("tour_site", "root", "", {
    host: "localhost",
    port: 3306,
    dialect: "mysql"
});

export const connect = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.")
    } catch (error) {
        console.error("Unable to connect to database: ", error);
    }
}
