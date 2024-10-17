import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const OrderItem = sequelize.define("order-item", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "orders",
            key: "id"
        }
    },
    tourId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "tours",
            key: "id"
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discount: {
        type: DataTypes.DECIMAL(5, 2),
    },
    timeStart: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, { tableName: "orders_item", timestamps: false });

export default OrderItem;