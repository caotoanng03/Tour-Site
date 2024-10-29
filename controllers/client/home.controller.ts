import { Request, Response } from "express";
import Tour from "../../models/tour.model";


// [GET] /welcome
export const welcome = async (req: Request, res: Response) => {

    const allTourRecords = await Tour.findAll({
        attributes: ['title', 'description', 'images'],
        where: {
            deleted: false,
            status: 'active'
        }
    })

    const tours = allTourRecords.map(item => ({
        title: item.dataValues.title,
        desc: item.dataValues.description,
        image: JSON.parse(item.dataValues.images)[0]
    }))

    res.render(`client/pages/welcome/index.pug`, {
        pageTitle: `MySapa`,
        tours
    })
}