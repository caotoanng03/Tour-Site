import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import slugify from "slugify";

const Tour = sequelize.define("tour", {
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
    description: {
        type: DataTypes.STRING(500),
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    images: {
        type: DataTypes.TEXT('long')
    },
    price: {
        type: DataTypes.DECIMAL(10, 2)
    },
    discount: {
        type: DataTypes.DECIMAL(5, 2)
    },
    information: {
        type: DataTypes.TEXT('long')
    },
    schedule: {
        type: DataTypes.TEXT('long')
    },
    hasPickup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    tourTag: {
        type: DataTypes.STRING(50)
    },
    timeStart: {
        type: DataTypes.DATE
    },
    stock: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.ENUM,
        values: ['active', 'inactive'],
        defaultValue: 'active'
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
    }
    // deletedAt: {
    //     type: DataTypes.DATE
    // },
    // createdAt: {
    //     type: DataTypes.DATE,
    //     allowNull: true
    // },
    // updatedAt: {
    //     type: DataTypes.DATE,
    //     allowNull: true
    // }
}, { tableName: "tours", timestamps: false });

Tour.beforeCreate((tour) => {
    tour["slug"] = slugify(`${tour["title"]}-${Date.now()}`, {
        lower: true,
        strict: true
    })
});

export default Tour;