import { Request, Response } from "express";
import Order from "../../models/order.model";

// [GET] /admin/orders
export const index = async (req: Request, res: Response): Promise<void> => {
    const orders = await Order.findAll({
        where: {
            deleted: false
        }
    })

    res.render(`admin/pages/orders/index.pug`, {
        pageTitle: `Orders`,
        orders
    })
}

// [GET] /admin/orders/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
    const orderId = req.params.id;

    const order = await Order.findOne({
        where: {
            id: orderId,
            deleted: false
        }
    })

    if (!order) {
        res.render(`errors/error.pug`, {
            code: 400,
            title: 'bad request'
        })
    }

    res.render(`admin/pages/orders/detail`, {
        pageTitle: `Detail order id: ${orderId}`,
        order
    })
}