import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Role = sequelize.define('role', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { tableName: 'roles', timestamps: false });

export default Role;