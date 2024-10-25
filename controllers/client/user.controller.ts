import { Request, Response } from "express"
import User from "../../models/user.model";
import md5 from "md5"
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
        attributes: ['email'],
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
        password: md5(req.body.password)
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

//[POST] /user/login
export const loginPost = async (req, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: {
            email: email,
            deleted: false
        }
    });

    if (!user) {
        req.flash('error', 'Email is incorrect!');
        res.redirect('back');
        return;
    }
    console.log(password)
    console.log(user.dataValues.password)

    if (md5(password) !== user.dataValues.password) {
        req.flash('error', 'Password is incorrect!');
        res.redirect('back');
        return;
    }

    if (user.dataValues.status === 'inactive') {
        req.flash('error', 'The account is suspended!');
        res.redirect('back');
        return;
    }

    res.cookie('tokenUser', user.dataValues.tokenUser);
    req.flash('success', 'Login successfully!');
    // TODO: redirect to home if login sucessful
    res.redirect('/categories');
}

//[GET] /user/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('tokenUser');
    // TODO: redirect to homepage
    res.redirect('/categories');
}