import { Request, Response } from "express";
import Order from "../../models/order.model";
import User from "../../models/user.model";
import md5 from "md5";
import { generateOrderCode, generateTempPassword } from "../../helpers/generate";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";
import { systemConfig } from "../../config/system";
import { Sequelize } from "sequelize";

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
        return;
    }

    res.render(`admin/pages/orders/detail`, {
        pageTitle: `Detail order id: ${orderId}`,
        order
    })
}

// [GET] /admin/orders/create
export const create = async (req: Request, res: Response): Promise<void> => {
    res.render(`admin/pages/orders/create.pug`, {
        pageTitle: 'Create Order'
    })
}

// [POST] /admin/orders/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
    // userId, code, fullName, email, phone, note, status,
    const { emailCustomer, tours, fullName, email, phone, note, status } = req.body;
    let userId = req.body.userId;

    // 1. create new user account if not existed
    const user = await User.findOne({
        attributes: ['id', 'fullName'],
        where: {
            email: emailCustomer,
            deleted: false
        }
    })
    // if not select the suggest user, userId will be underfined even if the user is already existed
    if (!userId || !user) {
        const tempPassword = generateTempPassword(10)
        const userData = {
            email,
            note,
            fullName,
            phone,
            password: md5(tempPassword)
        }

        const newUser = await User.create(userData);
        userId = newUser.dataValues.id;
    }

    // 2. create new order record
    const orderData = {
        code: "",
        userId,
        fullName,
        email,
        phone,
        note,
        status,
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

    // 3. create order_items records
    for (const item of tours) {
        const tour = JSON.parse(decodeURIComponent(item));

        const orderItemData = {
            orderId,
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

    req['flash']('success', 'New order was created successfully!');
    res.redirect(`/${systemConfig.prefixAdmin}/orders`);
}

// [GET] /admin/orders/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
    const orderId = req.params.id;

    const order = await Order.findOne({
        where: {
            id: orderId,
            deleted: false
        }
    });

    if (!order) {
        res.render(`errors/error.pug`, {
            code: 400,
            title: 'bad request'
        })
        return;
    }

    // retrieve user info
    const user = await User.findOne({
        attributes: ['id', 'fullName', 'email'],
        where: {
            id: order.dataValues.userId,
            deleted: false
        }
    })
    order['userInfo'] = user;

    // retrieve order_item info
    const orderItems = await OrderItem.findAll({
        where: {
            orderId
        }
    })

    for (const item of orderItems) {
        const tourInfo = await Tour.findOne({
            attributes: ['id', 'title', 'price', 'discount', 'stock'],
            where: {
                id: item.dataValues.tourId,
                deleted: false
            }
        })

        tourInfo['discounted_price'] = tourInfo.dataValues.price * (1 - tourInfo.dataValues.discount / 100);
        item['tourInfo'] = tourInfo;
    }

    res.render(`admin/pages/orders/edit.pug`, {
        pageTitle: `Edit order id:${orderId}`,
        order,
        orderItems
    })

}

// [PATCH] /admin/orders/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
    const orderId = req.params.id;
    const { tours, fullName, email, phone, note, status } = req.body;

    // 1. update order record
    const orderData = {
        fullName,
        email,
        phone,
        note,
        status,
    }

    await Order.update(orderData, {
        where: {
            id: orderId,
            deleted: false
        }
    });

    const orderItemRecords = await OrderItem.findAll({
        where: { orderId }
    })
    const existingTourIds = orderItemRecords.map(item => item.dataValues.tourId);


    // 2. update order_items records
    let listNewTourIds = [];
    for (const item of tours) {
        const tour = JSON.parse(decodeURIComponent(item));
        listNewTourIds[listNewTourIds.length] = tour.tourId;

        if (!existingTourIds.includes(tour.tourId)) {
            // if tourId was not exist in db, create new order_item
            const orderItemData = {
                orderId,
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

    }
    // 3. delete db order_items not includes in user providing id list
    const tourIdsToRemove = existingTourIds.filter(id => !listNewTourIds.includes(id));
    await OrderItem.update(
        { deleted: true },
        {
            where: {
                orderId: orderId,
                tourId: tourIdsToRemove,
            }
        }
    );

    req['flash']('success', `Order(id: ${orderId} was updated successfully!`);
    res.redirect(`/${systemConfig.prefixAdmin}/orders`);
}

// [DELETE] /admin/orders/delete/:id
export const deleteOrder = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('order_delete')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const orderId = req.params.id;

    // 1. update order.deleted = false
    await Order.update(
        { deleted: true },
        { where: { id: orderId } }
    )

    // 2. delete order_items has orderId: orderId
    await OrderItem.update(
        { deleted: true },
        {
            where: {
                orderId: orderId
            }
        }
    )


    req['flash']('success', `Order(id: ${orderId}) was deleted!`);
    res.redirect(`/${systemConfig.prefixAdmin}/orders`);
}