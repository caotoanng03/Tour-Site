import { Response, NextFunction } from "express";
import { isValidEmail } from "../../helpers/email";

export const editPatch = (req, res: Response, next: NextFunction) => {
    if (!req.body.fullName) {
        req.flash('error', "Email can't be empty!")
        res.redirect('back');
        return;
    }

    if (req.body.fullName.length < 5) {
        req.flash('error', 'Name must be at least 5 letters!');
        res.redirect('back');
        return;
    }

    if (!req.body.email) {
        req.flash('error', "Email can't be empty!");
        res.redirect('back');
        return;
    }

    if (!isValidEmail(req.body.email)) {
        req.flash('error', 'Invalid Email! Eg: example@gmail.com');
        res.redirect('back');
        return;
    }

    if (!req.body.roleId) {
        req.flash('error', "Role can't be empty!");
        res.redirect('back');
        return;
    }
    next();
}