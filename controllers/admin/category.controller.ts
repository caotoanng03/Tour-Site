import { Request, Response } from "express";
import Category from "../../models/category.model";

// [GET] /admin/categories
export const index = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('category_view')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const categories = await Category.findAll({
        where: {
            deleted: false,
            status: "active"
        },
        raw: true
    });

    res.render("admin/pages/categories/index", {
        pageTitle: "Categories",
        categories
    });
};