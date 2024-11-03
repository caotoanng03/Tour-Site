import { Response, NextFunction } from "express";

export const createPost = (req, res: Response, next: NextFunction) => {
    if (!req.body.title) {
        req.flash('error', "Role title can't be empty!")
        res.redirect('back');
        return;
    }
    if (req.body.title.length < 5) {
        req.flash('error', 'Role title must be at least 5 letters!');
        res.redirect('back');
        return;
    }
    next();
}