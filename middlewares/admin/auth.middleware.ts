import { Request, Response, NextFunction } from "express";
import { systemConfig } from "../../config/system";
import Admin from "../../models/admin.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const account = await Admin.findOne({
        attributes: { exclude: ['password', 'token'] },
        where: {
            token: token,
            deleted: false,
            status: 'active'
        }
    });

    if (!account) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    next();
}