import { Request, Response } from "express";
import GeneralSetting from "../../models/general-settings.model";
import { where } from "sequelize";

// [GET] /admin/settings/general
export const general = async (req: Request, res: Response): Promise<void> => {
    const settingGeneral = await GeneralSetting.findOne({});

    res.render(`admin/pages/settings/general.pug`, {
        pageTitle: 'General Settings',
        settingGeneral
    })
}

// [PATCH] /admin/settings/general
export const generalPatch = async (req, res: Response): Promise<void> => {

    const settingGeneral = await GeneralSetting.findOne({});

    if (!settingGeneral) {
        GeneralSetting.create(req.body)
        req.flash('success', 'Created new setting!');
        res.redirect('back');
        return;
    }

    await GeneralSetting.update(req.body, {
        where: {
            id: settingGeneral.dataValues.id
        }
    });

    req.flash('success', 'Settings Updated');
    res.redirect('back');
};