import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET] /tours/:slugCategory
export const getToursBaseOnCategrorySlug = async (req: Request, res: Response): Promise<void> => {
    const slugCategory: string = req.params.slugCategory;

    const tours = await sequelize.query(
        `
        SELECT tours.*, categories.title AS categoryTitle, ROUND(price * (1 - discount/100), 0) AS price_special
        FROM tours
        JOIN tours_categories ON tours.id = tours_categories.tour_id
        JOIN categories ON tours_categories.category_id = categories.id
        WHERE
            categories.slug = '${slugCategory}'
            AND categories.deleted = false
            AND categories.status = 'active'
            AND tours.deleted = false
            AND tours.status = 'active';
        `, {
        type: QueryTypes.SELECT
    });

    if (tours.length > 0) {
        tours.forEach(item => {
            if (item["images"]) {
                const images = JSON.parse(item["images"]);
                item["image"] = images[0];

                item["price_special"] = parseFloat(item["price_special"]);
            };
        });

        res.render(`client/pages/tours/index`, {
            pageTitle: "All tours: " + tours[0]["categoryTitle"],
            tours
        });
    } else {
        res.redirect(`/categories`)
    }
};

// [GET] /tours/detail/:slugTour
export const detail = async (req: Request, res: Response): Promise<void> => {
    const slugTour: string = req.params.slugTour;

    res.render(`client/pages/tours/detail`, {
        pageTile: 'Tour Detail',
    })
};