import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import * as textUtils from "../../helpers/textUtils";
import * as numberHelper from "../../helpers/numberUtils";
import { Op } from "sequelize";

// [GET] /search/:type
export const search = async (req: Request, res: Response): Promise<void> => {

    let searchTours = [];

    const keyword = req.query.keyword;
    const type = req.params.type;

    if (keyword) {
        const slug = textUtils.convertToSlug(keyword);

        const tours = await Tour.findAll({
            where: {
                slug: { [Op.like]: `%${slug}%` },
                deleted: false
            },
            attributes: ['id', 'title', 'price', 'discount', 'images']
        });

        for (const tour of tours) {
            const discounted_price = numberHelper.formatNumber(Number(tour.dataValues.price * (1 - tour.dataValues.discount / 100)));

            searchTours.push({
                id: tour.dataValues.id,
                title: tour.dataValues.title,
                image: JSON.parse(tour.dataValues.images)[0],
                price: numberHelper.formatNumber(Number(tour.dataValues.price)),
                discount: tour.dataValues.discount,
                discounted_price: discounted_price
            })
        }
    }

    switch (type) {
        case "result":
            res.render(`client/pages/search/result.pug`, {
                searchTours,
                pageTitle: `Results: "${keyword}"`
            })
            break;
        case "suggest":
            break;
        default:
            break;
    }
}