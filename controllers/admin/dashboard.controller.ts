import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import Order from "../../models/order.model";
import sequelize from "sequelize"
import OrderItem from "../../models/order-item.model";
import User from "../../models/user.model";

// [GET] /admin/dashboard
export const index = async (req: Request, res: Response) => {
    const totalOrders = await Order.count();

    const totalTours = await Tour.count();
    const activeTours = await Tour.count({ where: { status: "active" } });
    const inactiveTours = totalTours - activeTours;

    const totalCategories = await Category.count();
    const activeCategories = await Category.count({ where: { status: "active" } });
    const inactiveCategories = totalCategories - activeCategories;

    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { status: "active" } });
    const inactiveUsers = totalUsers - activeUsers;

    // Fetch order status counts
    const initialOrders = await Order.count({ where: { status: "initial" } });
    const processingOrders = await Order.count({ where: { status: "processing" } });
    const successOrders = await Order.count({ where: { status: "success" } });
    const failedOrders = await Order.count({ where: { status: "failed" } });

    // Calculate total revenue: SUM(quantity * price * (1 - discount))
    const totalRevenue = await OrderItem.findOne({
        attributes: [[
            sequelize.literal("SUM(quantity * price * (1 - (discount / 100)))"),
            "totalRevenue"
        ]],
        raw: true
    });

    res.render(`admin/pages/dashboard/index.pug`, {
        pageTitle: `Dashboard`,
        totalTours, activeTours, inactiveTours,
        totalCategories, activeCategories, inactiveCategories,
        totalUsers, activeUsers, inactiveUsers,
        initialOrders, processingOrders, successOrders, failedOrders,
        totalOrders,
        totalRevenue: totalRevenue['totalRevenue']
    });

}