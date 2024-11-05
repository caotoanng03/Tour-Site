import { Request, Response } from "express";
import Admin from "../../models/admin.model";
import md5 from "md5";
import { systemConfig } from "../../config/system";

// [GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {

    const token = req.cookies.token;

    if (!token) {
        res.render(`admin/pages/auth/login.pug`, {
            pageTitle: 'Admin'
        });
        return;
    }

    const account = await Admin.findOne({
        attributes: { exclude: ['password', 'token'] },
        where: {
            token: token,
            deleted: false,
            status: 'active'
        }
    })

    if (!account) {
        res.render(`admin/pages/auth/login.pug`, {
            pageTitle: 'Admin'
        })
        return;
    }

    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const account = await Admin.findOne({
        where: {
            email: email
        }
    })

    if (!account) {
        req['flash']('error', 'Email is incorrect!');
        res.redirect('back');
        return;
    }

    if (md5(password) !== account.dataValues.password) {
        req['flash']('error', 'Password is incorrect!');
        res.redirect('back');
        return;
    }

    if (account.dataValues.status === 'inactive') {
        req['flash']('error', 'Password is incorrect!');
        res.redirect('back');
        return;
    }

    res.cookie('token', account.dataValues.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
    res.clearCookie('token');
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}