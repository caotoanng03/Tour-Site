import { Request, Response } from "express";
import sequelize from "../../config/database";
import User from "../../models/user.model";
import * as normalize from "../../helpers/normalizeValue"


// [GET] /user/profile
export const profile = async (req: Request, res: Response): Promise<void> => {
    res.render(`client/pages/users/profile.pug`, {
        pageTitle: 'user profile'
    })
}

// [GET] /user/edit
export const editProfile = async (req, res: Response): Promise<void> => {
    res.render(`client/pages/users/profile-edit.pug`, {
        pageTitle: 'user edit profile'
    })
}

// [POST] /user/edit
export const editProfilePost = async (req, res: Response): Promise<void> => {
    const profileData = {};

    const user = await User.findOne({
        where: {
            tokenUser: req.cookies.tokenUser,
            deleted: false,
            status: 'active'
        }
    })

    // Populate profileData only if there is an actual change
    if (req.body.fullName !== undefined && req.body.fullName !== user.dataValues.fullName) {
        profileData['fullName'] = req.body.fullName;
    }

    if (req.body.email !== undefined && req.body.email !== user.dataValues.email) {
        profileData['email'] = req.body.email;
    }

    if (req.body.avatar !== undefined) {
        profileData['avatar'] = normalize.normalizeValue(req.body.avatar);
        if (profileData['avatar'] === user.dataValues.avatar) delete profileData['avatar'];
    }

    if (req.body.phone !== undefined) {
        profileData['phone'] = normalize.normalizeValue(req.body.phone);
        if (profileData['phone'] === user.dataValues.phone) delete profileData['phone'];
    }

    if (req.body.citizen !== undefined) {
        profileData['citizen'] = normalize.normalizeValue(req.body.citizen);
        if (profileData['citizen'] === user.dataValues.citizen) delete profileData['citizen'];
    }

    const setClause = Object.keys(profileData)
        .map(key => `${key} = :${key}`)
        .join(", ");


    if (!setClause) {
        req.flash('error', 'Nothing updated!')
        res.redirect('/user/profile')
        return;
    }

    await sequelize.query(
        `UPDATE users SET ${setClause} WHERE tokenUser = :tokenUser`,
        {
            replacements: { ...profileData, tokenUser: req.cookies.tokenUser },
            raw: true
        }
    );
    // redirect /user/profile

    req.flash('success', 'Profile updated!')
    res.redirect('/user/profile')
}