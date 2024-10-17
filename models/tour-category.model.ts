import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const TourCategory = sequelize.define("tour-category", {
    tourId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "tours",
            key: "id"
        }
    },
    categoryId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "categories",
            key: "id"
        }
    }
}, { tableName: "tours_categories", timestamps: false });

export default TourCategory;