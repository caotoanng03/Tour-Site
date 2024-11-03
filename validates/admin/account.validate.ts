import { Response, NextFunction } from "express";
import { isValidEmail } from "../../helpers/email";
import { isValidPassword } from "../../helpers/password";

export const createPost = (req, res: Response, next: NextFunction) => {
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
        req.flash('error', 'Invalid Email! Example: example@gmail.com');
        res.redirect('back');
        return;
    }
    if (!req.body.password) {
        req.flash('error', 'Password can not be empty!');
        res.redirect('back');
        return;
    }
    if (!isValidPassword(req.body.password)) {
        req.flash('error', 'Invalid Password! Password should contain at least 1 digit, 1 uppercase and 1 lowercase. Length should be from 6 to 20.');
        res.redirect('back');
        return;
    }
    if (!req.body.retypedPassword) {
        req.flash('error', 'Retyped password can not be empty!');
        res.redirect('back');
        return;
    }
    if (req.body.password !== req.body.retypedPassword) {
        req.flash('error', 'Retyped password does not match!');
        res.redirect('back');
        return;
    }
    if (!req.body.roleId) {
        req.flash('error', 'Role of admin must be chosen!');
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
    if ((req.body.password && !req.body.retypedPassword) || (!req.body.password && req.body.retypedPassword)) {
        req.flash('error', 'Either of password and retyped password can not be empty!');
        res.redirect('back');
        return;
    }
    if (req.body.password && !isValidPassword(req.body.password)) {
        req.flash('error', 'Invalid Password! Password should contain at least 1 digit, 1 uppercase and 1 lowercase. Length should be from 6 to 20.');
        res.redirect('back');
        return;
    }
    if (req.body.password !== req.body.retypedPassword) {
        req.flash('error', 'Retyped password does not match!');
        res.redirect('back');
        return;
    }
    if (!req.body.roleId) {
        req.flash('error', 'Role of admin must be chosen!');
        res.redirect('back');
        return;
    }
    next();
}