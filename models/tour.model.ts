import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const Tour = sequelize.define("tour", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    images: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    information: {
        type: DataTypes.STRING,
        allowNull: true
    },
    schedule: {
        type: DataTypes.STRING,
        allowNull: true
    },
    timeStart: {
        type: DataTypes.DATE,
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // createdAt: {
    //     type: DataTypes.DATE,
    //     allowNull: true
    // },
    // updatedAt: {
    //     type: DataTypes.DATE,
    //     allowNull: true
    // }
}, { tableName: "tours", timestamps: true });

export default Tour;