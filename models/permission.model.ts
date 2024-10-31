import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import Role from "./role.model";

const Permission = sequelize.define('permission', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, { tableName: 'permissions', timestamps: false });

export default Permission;
