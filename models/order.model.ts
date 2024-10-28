import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Order = sequelize.define("order", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    note: {
        type: DataTypes.STRING(500),
    },
    status: {
        type: DataTypes.ENUM,
        values: ['initial', 'processing', 'done', 'failed'],
        defaultValue: 'initial'
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // deletedAt: {
    //     type: DataTypes.DATE,
    // },
}, { tableName: "orders", timestamps: false });

export default Order;