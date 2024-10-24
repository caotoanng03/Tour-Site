import { Express } from "express";
import { tourRoutes } from "./tour.route";
import { categoryRoutes } from "./category.route";
import { cartRoutes } from "./cart.route";
import { orderRoutes } from "./order.route";
import { userRoutes } from "./user.route";
import * as userMiddleware from "../../middlewares/client/user.middleware";

const clientRoutes = (app: Express): void => {
    app.use(userMiddleware.userInfo)

    app.use(`/tours`, tourRoutes)

    app.use(`/categories`, categoryRoutes)

    app.use(`/cart`, cartRoutes)

    app.use(`/order`, orderRoutes)

    app.use(`/user`, userRoutes)
}

export default clientRoutes;