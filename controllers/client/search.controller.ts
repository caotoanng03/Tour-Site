import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import * as textUtils from "../../helpers/textUtils";
import * as numberHelper from "../../helpers/numberUtils";
import { Op } from "sequelize";

// [GET] /search/:type
export const search = async (req: Request, res: Response): Promise<void> => {

    let searchTours = [];

    const { dateRange, keyword } = req.query;
    const type = req.params.type;

    if (keyword) {
        const slug = textUtils.convertToSlug(keyword);

        const whereCondition = {
            slug: { [Op.like]: `%${slug}%` },
            deleted: false,
        };

        // handling date
        if (dateRange) {
            const [startDate, endDate] = dateRange.toString().split(' - ');
            const startDateParsed = new Date(startDate);
            const endDateParsed = new Date(endDate);

            whereCondition['timeStart'] = {
                [Op.between]: [startDateParsed, endDateParsed],
            };
        }

        const tours = await Tour.findAll({
            where: whereCondition,
            attributes: ['id', 'title', 'price', 'discount', 'images', 'timeStart']
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
                keyword,
                dateRange,
                pageTitle: `Results: "${keyword}"`
            })
            break;
        case "suggest":
            break;
        default:
            break;
    }
}