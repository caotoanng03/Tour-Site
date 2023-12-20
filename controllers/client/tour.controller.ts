import { Request, Response } from "express";
import Tour from "../../models/tour.model";

// [GET] /tours
export const index = async (req: Request, res: Response) => {
    // select * from tours where deleted = false and status = 'active'
    const tours = await Tour.findAll({ raw: true });

    res.render("client/pages/tours/index", {
        pageTitle: "Tour List",
        tours: tours
    });
};