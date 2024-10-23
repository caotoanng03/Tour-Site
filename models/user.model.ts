import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import { generateRandomString } from "../helpers/generate";

const User = sequelize.define("user", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    tokenUser: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: function () {
            return generateRandomString(30);
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
        type: DataTypes.STRING(11)
    },
    citizen: {
        type: DataTypes.STRING(20)
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
}, { tableName: "users", timestamps: false })

export default User;