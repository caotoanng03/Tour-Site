import { Request, Response } from "express";
import Role from "../../models/role.model";
import Admin from "../../models/admin.model";
import { systemConfig } from "../../config/system";

// [GET] /admin/my-account
export const index = async (req: Request, res: Response) => {
    res.render(`admin/pages/my-account/index.pug`, {
        pageTitle: 'Admin Profile'
    });
}

// [GET] /admin/my-account/edit 
export const edit = async (req: Request, res: Response) => {
    const roles = await Role.findAll({
        where: {
            deleted: false
        }
    })

    res.render(`admin/pages/my-account/edit.pug`, {
        pageTitle: 'Edit Admin Profile',
        roles
    });
}

// [PATCH] /admin/my-account/edit
export const editPatch = async (req: Request, res: Response) => {
    const adminAccountObject = {
        fullName: req.body.fullName,
        email: req.body.email
    }

    if (req.body.phone) {
        adminAccountObject['phone'] = req.body.phone;
    }

    if (req.body.avatar) {
        adminAccountObject['avatar'] = req.body.avatar
    }

    if (res.locals.role.permissions.includes('roles_permissions')) {
        if (req.body.roleId) adminAccountObject['roleId'] = req.body.roleId;

        if (req.body.status) adminAccountObject['status'] = req.body.status;
    }

    await Admin.update(adminAccountObject, {
        where: {
            id: res.locals.admin.id
        }
    })

    req['flash']('success', 'Updated Successfully!');
    res.redirect(`/${systemConfig.prefixAdmin}/my-account`);

}