import { Response, NextFunction } from "express";

export const loginPost = (req, res: Response, next: NextFunction) => {
    if (!req.body.email) {
        req.flash('error', 'Email can not be empty!')
        res.redirect('back');
        return;
    }

    if (!req.body.password) {
        req.flash('error', 'Password can not be empty!');
        res.redirect('back');
        return;
    }

    next();
}