import { Request, Response } from "express";

// [GET] /cart
export const index = async (req: Request, res: Response): Promise<void> => {

    res.render("client/pages/carts/index", {
        pageTitle: "Cart"
    });
};