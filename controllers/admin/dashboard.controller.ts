import { Request, Response } from "express";

// [GET] /admin/dashboard
export const index = async (req: Request, res: Response) => {

    res.render(`admin/pages/dashboard/index.pug`, {
        pageTitle: 'Admin Dashboard'
    })
}