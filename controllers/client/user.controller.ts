import { Request, Response } from "express"
import User from "../../models/user.model";
import md5 from "md5"
import * as generateHelper from "../../helpers/generate"
import ForgotPassword from "../../models/forgot-password.model";
import { sendMail as sendMailHelper } from "../../helpers/sendMail"
import sequelize from "../../config/database";

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

// [GET] /user/password/forgot
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    res.render(`client/pages/users/otp-send.pug`, {
        pageTitle: 'forgot pass / enter email'
    });
}

// [POST] /user/password/forgot
export const forgotPasswordPost = async (req, res: Response): Promise<void> => {
    const email: string = req.body.email;

    // step 1: check email
    const user = await User.findOne({
        attributes: { exclude: ['password', 'tokenUser'] },
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

    // step 2: create otp and store to db
    const otp = generateHelper.generateRandomNumber(6);
    const expirationTime = new Date(Date.now() + 1 * 60 * 1000);

    const forgotPasswordObject = {
        email,
        otp,
        expireAt: expirationTime
    }

    // store to db
    await ForgotPassword.create(forgotPasswordObject);

    // step 3: send otp code to user's email
    const subject = `[MySapa] Your OTP reset code`;
    const html = `
    <p>A password recovery event has been triggered. Here is your otp code: <strong>${otp}</strong></p>
    <p>The OTP code is limited to 3 minutes.</p>
    <p>If you do not reset your password within 3 minutes, you will need to submit a new request.</p>
    `;

    sendMailHelper(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/otp
export const otpPassword = async (req, res: Response): Promise<void> => {
    const { email } = req.query;

    res.render(`client/pages/users/otp-verify.pug`, {
        pageTitle: 'forgot password / verify otp',
        email
    });
}

// [POST] /user/password/otp
export const otpPasswordPost = async (req, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    const existedOtp = await ForgotPassword.findOne({
        where: {
            email: email,
            otp: otp
        }
    });

    if (!existedOtp) {
        req.flash('error', 'Otp is invalid!');
        res.redirect('back');
        return;
    }

    const user = await User.findOne({
        where: {
            email: email,
            deleted: false
        }
    })

    res.cookie('tokenUser', user.dataValues.tokenUser);
    res.redirect(`/user/password/reset`);
}

// [GET] /user/password/reset
export const resetPassword = async (req, res: Response): Promise<void> => {

    res.render(`client/pages/users/reset-password.pug`, {
        pageTitle: 'reset password'
    });
}

// [POST] /user/password/reset
export const resetPasswordPost = async (req, res: Response): Promise<void> => {
    const { password } = req.body;
    const tokenUser = req.cookies.tokenUser;

    const user = await User.findOne({
        where: {
            tokenUser: req.cookies.tokenUser
        }
    });

    if (!user) {
        res.redirect('back');
        return;
    }

    const hashedPassword = md5(password);

    await sequelize.query(
        `
    UPDATE users
    SET password = :password
    WHERE tokenUser = :tokenUser
    `,
        {
            replacements: {
                password: hashedPassword,
                tokenUser: tokenUser
            },
            raw: true
        }
    );

    req.flash('success', 'You password was reset successfully!');
    res.redirect('/categories');
}