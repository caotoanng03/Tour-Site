import { Express } from "express";
import { systemConfig } from "../../config/system";
import { categoryRoutes } from "./category.route";


const adminRoutes = (app: Express): void => {
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.use(`${PATH_ADMIN}/categories`, categoryRoutes);

};

export default adminRoutes;

