import { Request, Response } from "express";
import Role from "../../models/role.model";

// [GET] /admin/roles/
export const index = async (req: Request, res: Response) => {

    const roles = await Role.findAll({
        where: {
            deleted: false
        }
    }) || [];

    res.render(`admin/pages/roles/index.pug`, {
        pageTitle: `Role Management`,
        roles
    })
}