import { DataType, DataTypes } from "sequelize";
import sequelize from "../config/database";

const GeneralSetting = sequelize.define("general_settings", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    websiteName: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    logo: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(15)
    },
    whatsapp: {
        type: DataTypes.STRING(15)
    },
    email: {
        type: DataTypes.STRING(255)
    },
    address: {
        type: DataTypes.STRING(255)
    },
    map: {
        type: DataTypes.STRING(500)
    },
    instagram: {
        type: DataTypes.STRING(500)
    },
    facebook: {
        type: DataTypes.STRING(500)
    },
    x: {
        type: DataTypes.STRING(500)
    },
    linkedin: {
        type: DataTypes.STRING(500)
    },
    copyright: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, { tableName: "general_settings", timestamps: false });

export default GeneralSetting;