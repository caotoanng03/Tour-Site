import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";

export const userInfo = async (req, res: Response, next: NextFunction) => {
    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                tokenUser: req.cookies.tokenUser,
                deleted: false
            }
        })

        if (user) {
            res.locals.user = user;
        }
    }

    next();
}