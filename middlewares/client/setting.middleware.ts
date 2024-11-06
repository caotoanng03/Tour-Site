import { Request, Response, NextFunction } from "express";
import GeneralSetting from "../../models/general-settings.model";

export const settingGeneral = async (req: Request, res: Response, next: NextFunction) => {
    const settingGeneral = await GeneralSetting.findOne({})

    res.locals.settingGeneral = settingGeneral;

    next();
};