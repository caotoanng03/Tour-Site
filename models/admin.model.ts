import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import { generateRandomString } from "../helpers/generate";

const Admin = sequelize.define("admin", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: function () {
            return generateRandomString(30);
        }
    },
    roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "roles",
            key: "id"
        }
    },
    fullName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING(500),
    },
    phone: {
        type: DataTypes.STRING(15)
    },
    status: {
        type: DataTypes.ENUM,
        values: ['active', 'inactive'],
        defaultValue: 'active'
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { tableName: "admins", timestamps: false })

export default Admin;