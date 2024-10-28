import { Request, Response } from "express";
import Order from "../../models/order.model";
import { generateOrderCode } from "../../helpers/generate";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";
import md5 from "md5";
import * as generate from "../../helpers/generate";
import { sendMail as sendMailHelper } from "../../helpers/sendMail"
import User from "../../models/user.model";

// [POST] /order
export const order = async (req: Request, res: Response) => {
    const data = req.body;
    let user = res.locals.user;
    let userId = user.dataValues.id;

    if (data.cart.length <= 0) {
        res.json({
            code: 400,
            message: "Failed Order!"
        })
        return;
    }


    // create a new account for unloggedin users
    if (!user) {
        const tempPassword = 'mysapa' + generate.generateTempPassword(4);
        const fullName: string = req.body.info.fullName;
        const email: string = req.body.info.email;
        const phone: string = req.body.info.phone;

        const userData = {
            fullName,
            email,
            phone,
            password: md5(tempPassword)
        }

        const newUser = await User.create(userData);
        user = newUser;
        userId = user.dataValues.id;

        // send account for customer via email
        const subject = `[MySapa] Your new account information!`;
        const html = `
        <p>You have made a tour reservation. Below is your account.
        Make sure to change your password!</p>
        <p>Email</p> <strong>${email}</strong>
        <p>Password</p> <strong>${tempPassword}</strong>
        <p>Thank you for choosing our service.</p>
        `;

        sendMailHelper(email, subject, html);
    }


    // create a new order record with userId as a foreign key
    // Store to orders table
    const orderData = {
        code: "",
        userId: userId,
        fullName: data.info.fullName,
        email: data.info.email,
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

};

// [GET] /order/success/:orderCode
export const success = async (req: Request, res: Response) => {
    const orderCode = req.query.orderCode;

    const order = await Order.findOne({
        where: {
            code: orderCode,
            deleted: false
        },
        raw: true
    });

    if (order) {
        const orderItems = await OrderItem.findAll({
            where: {
                orderId: order["id"]
            },
            raw: true
        });

        for (const item of orderItems) {
            const tourInfo = await Tour.findOne({
                where: {
                    id: item["tourId"],
                    deleted: false,
                    status: "active"
                },
                raw: true
            });
            item["title"] = tourInfo["title"];
            item["image"] = JSON.parse(tourInfo["images"])[0];
            item["slug"] = tourInfo["slug"];
            item["discounted_price"] = item["price"] * (1 - item["discount"] / 100);
            item["total"] = item["quantity"] * item["discounted_price"];
        };
        order["code"] = orderCode;
        order["total_bill"] = orderItems.reduce((sum, item) => sum + item["total"], 0);

        res.render(`client/pages/orders/success`, {
            pageTitle: "Success Order",
            order,
            orderItems
        });
    } else {
        res.render('client/pages/errors/404');
    }
};