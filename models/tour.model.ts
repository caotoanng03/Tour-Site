import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import slugify from "slugify";

const Tour = sequelize.define("tour", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(10)
    },
    images: {
        type: DataTypes.TEXT('long')
    },
    price: {
        type: DataTypes.INTEGER
    },
    discount: {
        type: DataTypes.INTEGER,
    },
    information: {
        type: DataTypes.TEXT('long')
    },
    schedule: {
        type: DataTypes.TEXT('long')
    },
    timeStart: {
        type: DataTypes.DATE
    },
    stock: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.STRING(20)
    },
    position: {
        type: DataTypes.INTEGER
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deletedAt: {
        type: DataTypes.DATE
    },
    // createdAt: {
    //     type: DataTypes.DATE,
    //     allowNull: true
    // },
    // updatedAt: {
    //     type: DataTypes.DATE,
    //     allowNull: true
    // }
}, { tableName: "tours", timestamps: true });

Tour.beforeCreate((tour) => {
    tour["slug"] = slugify(`${tour["title"]}-${Date.now()}`, {
        lower: true,
        strict: true
    })
});

export default Tour;