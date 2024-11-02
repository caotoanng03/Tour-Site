import { Express } from "express";
import { systemConfig } from "../../config/system";
import { categoryRoutes } from "./category.route";
import { tourRoutes } from "../admin/tour.route";
import { uploadRoutes } from "./upload.route";
import { roleRoutes } from "./role.route";
import { accountRoutes } from "./account.route";
import { authRoutes } from "./auth.route";
import { dashboardRoutes } from "./dashboard.route";
import { myAccountRoutes } from "./my-account.route";

import * as authMiddleware from "../../middlewares/admin/auth.middleware";
import * as authController from "../../controllers/admin/auth.controller";

const adminRoutes = (app: Express): void => {
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.get(PATH_ADMIN, authController.login);

    app.use(`${PATH_ADMIN}/auth`, authRoutes);

    app.use(`${PATH_ADMIN}/my-account`, authMiddleware.requireAuth, myAccountRoutes);

    app.use(`${PATH_ADMIN}/dashboard`, authMiddleware.requireAuth, dashboardRoutes);

    app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, accountRoutes);

    app.use(`${PATH_ADMIN}/categories`, authMiddleware.requireAuth, categoryRoutes);

    app.use(`${PATH_ADMIN}/tours`, authMiddleware.requireAuth, tourRoutes);

    app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, roleRoutes);

    app.use(`${PATH_ADMIN}/upload`, authMiddleware.requireAuth, uploadRoutes);
};

export default adminRoutes;

