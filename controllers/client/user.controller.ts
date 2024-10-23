import { Request, Response } from "express"
import User from "../../models/user.model";

// [GET] /user/register 
export const register = async (req: Request, res: Response): Promise<void> => {

    res.render(`client/pages/users/index`, {
        pageTitle: "Register/Login"
    });
}

// [POST] /user/register
export const registerPost = async (req, res: Response): Promise<void> => {

    const email: string = req.body.email;

    const existedUser = await User.findOne({
        where: {
            email: email,
        },
        raw: true
    });

    if (existedUser) {
        req.flash('error', 'Email already existed!');
        res.redirect('back')
        return;
    }

    const userData = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password
    }

    if (req.body.avatar) {
        userData['avatar'] = req.body.avatar
    }

    if (req.body.phone) {
        userData['phone'] = req.body.phone
    }

    const newUser = await User.create(userData);

    res.cookie('tokenUser', newUser.dataValues.tokenUser);

    req.flash('success', 'You successfully registered new account!')
    res.redirect('/categories');
}