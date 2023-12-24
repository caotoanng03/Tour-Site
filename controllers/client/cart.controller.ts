import { Request, Response } from "express";
import Tour from "../../models/tour.model";

// [GET] /cart
export const index = async (req: Request, res: Response): Promise<void> => {

    res.render("client/pages/carts/index", {
        pageTitle: "Cart"
    });
};

// [GET] /cart/list-json
export const listJson = async (req: Request, res: Response): Promise<void> => {
    const tours = req.body;

    for (const tour of tours) {
        const tourInfo = await Tour.findOne({
            where: {
                id: tour.tourId,
                deleted: false,
                status: "active"
            },
            raw: true
        });

        tour["image"] = JSON.parse(tourInfo["images"])[0];
        tour["title"] = tourInfo["title"];
        tour["discounted_price"] = tourInfo["price"] * (1 - tourInfo["discount"] / 100);
        tour["total"] = tour["discounted_price"] * tour["quantity"];
        tour["info"] = tourInfo;
    };

    res.json({
        tours
    });
};