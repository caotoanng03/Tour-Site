import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import TourCategory from "../../models/tour-category.model";
import { systemConfig } from "../../config/system";
import { generateTourCode } from "../../helpers/generate";
import { normalizeValue } from "../../helpers/normalizeValue";
import sequelize from "../../config/database";
import { Sequelize, where } from "sequelize";

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
        pageTitle: "Tours",
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
        timeStart: req.body.timeStart,
        stock: parseInt(req.body.stock),
        position: req.body.position,
        status: req.body.status
    };

    const { hasPickup, tourTag, schedule, information, description, discount } = req.body;

    if (tourTag) tourData['tourTag'] = tourTag;
    if (schedule) tourData['schedule'] = schedule;
    if (information) tourData['information'] = information;
    if (description) tourData['description'] = description;
    if (discount) tourData['discount'] = discount;
    if (hasPickup) tourData['hasPickup'] = 1;

    console.log(tourData);

    // create new tour
    const tour = await Tour.create(tourData);
    const tourId = tour["id"];

    const dataTourCategory = {
        tourId: tourId,
        categoryId: parseInt(req.body.categoryId)
    };

    // create new tour_category
    await TourCategory.create(dataTourCategory);

    res.redirect(`/${systemConfig.prefixAdmin}/tours`);
};

// [GET] /admin/tours/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('tour_edit')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const tourId = req.params.id;

    const tour = await Tour.findOne({
        where: {
            id: tourId,
            deleted: false
        }
    });

    if (!tour) {
        res.render(`errors/error.pug`, {
            code: 400,
            title: 'bad request'
        })
        return;
    }

    const category = await TourCategory.findOne({
        attributes: ['categoryId'],
        where: {
            tourId: tourId
        }
    });

    const categories = await Category.findAll({
        attributes: ['id', 'title'],
        where: {
            deleted: false
        }
    })

    tour.dataValues.timeStart = tour.dataValues.timeStart.toISOString().slice(0, 16);
    tour['categoryId'] = category.dataValues.categoryId;

    res.render(`admin/pages/tours/edit`, {
        pageTitle: `Edit Tour ID: ${tourId}`,
        tour,
        categories
    })

};

// [PATCH] /admin/tours/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
    const tourId = req.params.id;

    if (!res.locals.role.permissions.includes('tour_edit')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const numberOfAllTour = await Tour.count({});

    if (!req.body.position) {
        req.body.position = numberOfAllTour + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    };

    const tourData = {
        title: req.body.title,
        price: parseFloat(req.body.price),
        timeStart: req.body.timeStart,
        stock: parseInt(req.body.stock),
        position: req.body.position,
        status: req.body.status
    };

    const { images, hasPickup, tourTag, schedule, information, description, discount } = req.body;
    if (images) tourData['images'] = JSON.stringify(req.body.images);
    if (tourTag) tourData['tourTag'] = tourTag;
    if (schedule) tourData['schedule'] = schedule;
    if (information) tourData['information'] = information;
    if (description) tourData['description'] = description;
    if (discount) tourData['discount'] = discount;
    if (hasPickup) tourData['hasPickup'] = 1;

    // update tour
    await Tour.update(tourData, {
        where: {
            id: tourId,
            deleted: false
        }
    });

    // check and update categoryId
    const category = await TourCategory.findOne({
        attributes: ['categoryId'],
        where: {
            tourId: tourId
        }
    })

    if (category.dataValues.categoryId !== req.body.categoryId) {
        await TourCategory.update(
            { categoryId: req.body.categoryId },
            { where: { tourId: tourId } }
        )
    }

    res.redirect(`/${systemConfig.prefixAdmin}/tours`);
}

// [DELETE] /admin/tours/delete/:id
export const deleteTour = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('tour_delete')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const tourId = req.params.id;

    await Tour.update(
        { deleted: true },
        { where: { id: tourId } }
    )

    req['flash']('success', `The tour id(${tourId}) was deleted!`);
    res.redirect(`/${systemConfig.prefixAdmin}/tours`);
}

// [GET] /admin/tours/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
    const tourId = req.params.id;

    const tour = await Tour.findOne({
        where: {
            id: tourId,
            deleted: false
        }
    });

    if (!tour) {
        res.render(`errors/error.pug`, {
            code: 400,
            title: 'bad request'
        })
        return;
    }

    const category = await TourCategory.findOne({
        where: {
            tourId: tourId
        }
    });

    tour['categoryTitle'] = category.dataValues.title;
    tour['image'] = JSON.parse(tour.dataValues.images)[0];
    // tour.dataValues.timeStart = tour.dataValues.timeStart.toISOString().slice(0, 16);

    res.render(`admin/pages/tours/detail`, {
        pageTitle: `Detail Tour ID: ${tourId}`,
        tour
    });
}