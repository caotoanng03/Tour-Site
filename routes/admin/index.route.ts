import { Express } from "express";
import { systemConfig } from "../../config/system";
import { categoryRoutes } from "./category.route";
import { tourRoutes } from "../admin/tour.route";
import { uploadRoutes } from "./upload.route";
import { roleRoutes } from "./role.route";
import { accountRoutes } from "./account.route";


const adminRoutes = (app: Express): void => {
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.use(`${PATH_ADMIN}/accounts`, accountRoutes);

    app.use(`${PATH_ADMIN}/categories`, categoryRoutes);

    app.use(`${PATH_ADMIN}/tours`, tourRoutes);

    app.use(`${PATH_ADMIN}/roles`, roleRoutes);

    app.use(`${PATH_ADMIN}/upload`, uploadRoutes);
};

export default adminRoutes;

