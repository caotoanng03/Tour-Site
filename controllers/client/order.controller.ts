import { Request, Response } from "express";
import Order from "../../models/order.model";
import { generateOrderCode } from "../../helpers/generate";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";

// [POST] /order
export const order = async (req: Request, res: Response) => {
    const data = req.body;

    if (data.cart.length > 0) {
        // Store to orders table
        const orderData = {
            code: "",
            fullName: data.info.fullName,
            phone: data.info.phone,
            note: data.info.note,
            status: "initial",
        }

        const order = await Order.create(orderData);
        const orderId = order.dataValues.id;
        const code = generateOrderCode(orderId);
        await Order.update({
            code: code
        }, {
            where: {
                id: orderId
            }
        });

        // Store to orders_item table

        for (const tour of data.cart) {

            const orderItemData = {
                orderId: orderId,
                tourId: tour.tourId,
                quantity: tour.quantity,
            }

            const tourInfo = await Tour.findOne({
                where: {
                    id: tour.tourId,
                    deleted: false,
                    status: "active"
                },
                raw: true
            })

            orderItemData["price"] = tourInfo["price"];
            orderItemData["discount"] = tourInfo["discount"];
            orderItemData["timeStart"] = tourInfo["timeStart"];

            await OrderItem.create(orderItemData);
        }

        res.json({
            code: 200,
            message: "Order Success!",
            orderCode: code
        });
    } else {
        res.json({
            code: 400,
            message: "Failed Order!"
        })
    }
};

// [GET] /order/success/:orderCode
export const success = async (req: Request, res: Response) => {
    console.log(req.params.orderCode);

    res.render(`client/pages/carts/success`, {
        pageTitle: "Success Order",
    });
};