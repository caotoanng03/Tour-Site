import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import TourCategory from "../../models/tour-category.model";
import { systemConfig } from "../../config/system";
import { generateTourCode } from "../../helpers/generate";

// [GET] /admin/tours
export const index = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('tour_view')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

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
        pageTitle: "Tour Management",
        tours
    });
};

// [GET] /admin/tours/create
export const create = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('tour_create')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    // select * from categories where deleted = false and status = 'active';
    const categories = await Category.findAll({
        where: {
            deleted: false,
            status: 'active'
        },
        raw: true
    });

    res.render("admin/pages/tours/create", {
        pageTitle: "Create New Tour",
        categories
    });

};

// [POST] /admin/tours/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('tour_create')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const numberOfAllTour = await Tour.count({});

    const code = generateTourCode(numberOfAllTour + 1);

    if (!req.body.position) {
        req.body.position = numberOfAllTour + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    };

    const tourData = {
        title: req.body.title,
        code: code,
        images: JSON.stringify(req.body.images),
        price: parseInt(req.body.price),
        discount: parseInt(req.body.discount),
        timeStart: req.body.timeStart,
        stock: parseInt(req.body.stock),
        position: req.body.position,
        status: req.body.status,
        information: req.body.information,
        schedule: req.body.schedule
    };

    const tour = await Tour.create(tourData);
    const tourId = tour["id"];

    const dataTourCategory = {
        tour_id: tourId,
        category_id: parseInt(req.body.category_id)
    };

    await TourCategory.create(dataTourCategory);

    res.redirect(`/${systemConfig.prefixAdmin}/tours`);
};