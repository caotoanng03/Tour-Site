import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const TourCategory = sequelize.define("tour-category", {
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "tours",
            key: "id"
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "categories",
            key: "id"
        }
    }
}, { tableName: "tours_categories", timestamps: false });

export default TourCategory;