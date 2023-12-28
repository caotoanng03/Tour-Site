import { Request, Response } from "express";

// [GET] /admin/upload
export const upload = async (req: Request, res: Response): Promise<void> => {
    res.json({
        location: req.body.file
    });
};