import { Request, Response, NextFunction } from "express";
import { normalizeValue } from "../../helpers/normalizeValue";

export const createPost = async (req: Request, res: Response, next: NextFunction) => {

    req.body.tourTag = normalizeValue(req.body.tourTag);
    req.body.information = normalizeValue(req.body.information);
    req.body.schedule = normalizeValue(req.body.schedule);
    req.body.description = normalizeValue(req.body.description);
    if (req.body.discount) {
        req.body.discount = Number(parseFloat(req.body.discount).toFixed(2));
    }

    next();
}