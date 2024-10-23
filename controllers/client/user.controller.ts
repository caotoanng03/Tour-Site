import { Request, Response } from "express"

// [GET] /user/register 
export const register = async (req: Request, res: Response): Promise<void> => {

    res.render(`client/pages/users/index`, {
        pageTitle: "Register/Login"
    });
}