import { Request, Response } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";
import { where } from "sequelize";

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

// [GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {

    res.render(`admin/pages/roles/create.pug`, {
        pageTitle: 'Add New Role'
    })
}

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
    const roleObject = {
        title: req.body.title
    }

    if (req.body.desc) {
        roleObject['description'] = req.body.desc;
    }

    const newRole = await Role.create(roleObject);
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
    const roleId = `${req.params.id}`;

    try {
        const role = await Role.findOne({
            where: {
                id: roleId,
                deleted: false
            }
        })

        res.render(`admin/pages/roles/edit.pug`, {
            pageTitle: 'Edit Role',
            role
        })
    } catch (err) {
        //  TODO: redirect to 404 page
        res.redirect(`/${systemConfig.prefixAdmin}/roles`)
    }

}

// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const roleId = `${req.params.id}`;

    try {
        let desc = req.body.desc;

        if (desc.trim() == '') {
            desc = null;
        }

        const roleObject = {
            title: req.body.title,
            description: desc
        }

        await Role.update(roleObject, {
            where: {
                id: roleId,
                deleted: false
            }
        })

        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    } catch (err) {
        //  TODO: redirect to 404 page
        res.redirect(`/${systemConfig.prefixAdmin}/roles`)
    }
}

// [GET] /admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
    const roleId: string = `${req.params.id}`;

    try {
        const role = await Role.findOne({
            where: {
                id: roleId,
                deleted: false
            }
        })

        res.render(`admin/pages/roles/detail.pug`, {
            pageTitle: 'Role Detail',
            role
        })
    } catch (error) {
        //  TODO: redirect to 404 page
        res.redirect(`/${systemConfig.prefixAdmin}/roles`)
    }
}

// [DELETE] /admin/roles/delete/:id
export const deleteRole = async (req: Request, res: Response) => {
    const roleId: string = `${req.params.id}`;

    try {
        await Role.update(
            { deleted: true },
            { where: { id: roleId } }
        );

        res.redirect(`back`)

    } catch (error) {
        // TODO: redirect to 404 page
        res.redirect(`/${systemConfig.prefixAdmin}/roles`)
    }
}



