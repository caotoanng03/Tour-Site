import { Request, Response, NextFunction } from "express"
import User from "../../models/user.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.tokenUser) {
        res.redirect(`/user/login`)
        return;
    }

    const user = await User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            tokenUser: req.cookies.tokenUser,
            deleted: false,
            status: 'active'
        }
    })

    if (!user) {
        res.redirect(`/user/login`)
        return;
    }

    next();
}