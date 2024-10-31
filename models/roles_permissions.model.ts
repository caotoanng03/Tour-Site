import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const RolePermission = sequelize.define("role-permission", {
    roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "roles",
            key: "id"
        }
    },
    permissionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "permissions",
            key: "id"
        }
    }
}, { tableName: "roles_permissions", timestamps: false });

export default RolePermission;