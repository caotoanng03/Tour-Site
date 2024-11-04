import { Request, Response, NextFunction } from "express";
import { isValidEmail } from "../../helpers/email";
import { isValidPassword } from "../../helpers/password";

export const createPost = async (req, res: Response, next: NextFunction): Promise<void> => {
    if (!req.body.fullName) {
        req.flash('error', "Full name can't be empty!");
        res.redirect('back');
        return;
    }
    if (req.body.fullName.length <= 5) {
        req.flash('error', 'Full name length must be greater than 5 characters!');
        res.redirect('back');
        return;
    }
    if (!req.body.email) {
        req.flash('error', "Email can't be empty!");
        res.redirect('back');
        return;
    }
    if (!isValidEmail(req.body.email)) {
        req.flash('error', 'Email must be in proper format!');
        res.redirect('back');
        return;
    }
    if (!req.body.password) {
        req.flash('error', 'Password can not be empty!');
        res.redirect('back');
        return;
    }
    if (!isValidPassword(req.body.password)) {
        req.flash('error', 'Password must include 1 digit, 1 upper and 1 lower. Length from 6 - 20.');
        res.redirect('back');
        return;
    }
    next();
}
export const editPatch = (req, res: Response, next: NextFunction) => {
    if (!req.body.fullName) {
        req.flash('error', 'Name can not be empty!')
        res.redirect('back');
        return;
    }
    if (req.body.fullName.length < 5) {
        req.flash('error', 'Name must be at least 5 letters!');
        res.redirect('back');
        return;
    }
    if (!req.body.email) {
        req.flash('error', 'Email can not be empty!');
        res.redirect('back');
        return;
    }
    if (!isValidEmail(req.body.email)) {
        req.flash('error', 'Invalid Email! The valid email should be like: example@gmail.com');
        res.redirect('back');
        return;
    }
    if (req.body.password && !isValidPassword(req.body.password)) {
        req.flash('error', 'Invalid Password! Password should contain at least 1 digit, 1 uppercase and 1 lowercase. Length should be from 6 to 20.');
        res.redirect('back');
        return;
    }
    next();
}