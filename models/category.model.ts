import sequelize from "../config/database";
import { DataTypes, INTEGER } from "sequelize";
import slugify from "slugify";

const Category = sequelize.define("category", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING(500)
    },
    description: {
        type: DataTypes.TEXT('long')
    },
    status: {
        type: DataTypes.ENUM,
        values: ['active', 'inactive'],
        defaultValue: 'active'
    },
    position: {
        type: INTEGER
    },
    slug: {
        type: DataTypes.STRING(255)
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // deletedAt: {
    //     type: DataTypes.DATE
    // }
}, { tableName: "categories", timestamps: false });

Category.beforeCreate((tour) => {
    tour["slug"] = slugify(`${tour["title"]}-${Date.now()}`, {
        lower: true,
        strict: true
    })
});

export default Category;