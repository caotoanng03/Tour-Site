import { Response, NextFunction } from "express";
import { isValidEmail } from "../../helpers/email";
import { isValidPassword } from "../../helpers/password";

export const registerPost = (req, res: Response, next: NextFunction) => {

    if (!req.body.fullName) {
        // req.flash is not available in Request of express
        req.flash('error', 'Full name can not be empty!');
        res.redirect('back');
        return;
    }

    if (!req.body.email) {
        req.flash('error', 'Email can not be empty!');
        res.redirect('back');
        return;
    }

    if (!req.body.password) {
        req.flash('error', 'Password can not be empty!');
        res.redirect('back');
        return;
    }

    if (!isValidEmail(req.body.email)) {
        req.flash('error', 'Email must be in proper format!');
        res.redirect('back');
        return;
    }

    if (!isValidPassword(req.body.password)) {
        req.flash('error', 'Password must be 6-20 including 1 digit, 1 uppercase and 1 lowercase!');
        res.redirect('back');
        return;
    }

    next();

}