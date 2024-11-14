import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import * as numberHelper from "../../helpers/numberUtils";


// [GET] /welcome
export const welcome = async (req: Request, res: Response) => {

    const allTourRecords = await Tour.findAll({
        attributes: ['title', 'description', 'images'],
        where: {
            deleted: false,
            status: 'active'
        },
        limit: 10
    })

    const tours = allTourRecords.map(item => ({
        title: item.dataValues.title,
        desc: item.dataValues.description,
        image: JSON.parse(item.dataValues.images)[0]
    }))

    res.render(`client/pages/home/welcome.pug`, {
        pageTitle: `MySapa`,
        tours
    })
}

// [GET] /
export const index = async (req: Request, res: Response) => {
    const tours = await Tour.findAll({
        where: {
            deleted: false
        },
        limit: 12
    });

    for (const tour of tours) {
        tour["image"] = JSON.parse(tour.dataValues.images)[0];
        tour["discounted_price"] = numberHelper.formatNumber(Number(tour.dataValues.price) * (1 - tour.dataValues.discount / 100));
        tour["price"] = numberHelper.formatNumber(Number(tour.dataValues.price));
    }

    res.render(`client/pages/home/index.pug`, {
        pageTitle: `Explore Us`,
        tours
    })
}