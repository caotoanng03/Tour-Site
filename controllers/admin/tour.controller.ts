import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";

// [GET] /admin/tours
export const index = async (req: Request, res: Response): Promise<void> => {
    // select * from tours where deleted = false;
    const tours = await Tour.findAll({
        where: {
            deleted: false
        },
        raw: true
    });

    for (const tour of tours) {

        if (tour["images"]) {
            tour["image"] = JSON.parse(tour["images"])[0];
        }

        tour["discounted_price"] = tour["price"] * (1 - tour["discount"] / 100);
    };

    res.render("admin/pages/tours/index", {
        pageTitle: "Admin",
        tours
    });
};

// [GET] /admin/tours/create
export const create = async (req: Request, res: Response): Promise<void> => {
    // select * from categories where deleted = false and status = 'active';

    const categories = await Category.findAll({
        where: {
            deleted: false,
            status: 'active'
        },
        raw: true
    });

    res.render("admin/pages/tours/create", {
        pageTitle: "Admin",
        categories
    });

};