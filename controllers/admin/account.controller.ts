import { Request, Response } from "express";
import Admin from "../../models/admin.model";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";
import md5 from "md5";

// [GET] /admin/accounts/
export const index = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('account_view')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const accounts = await Admin.findAll({
        attributes: { exclude: ['password', 'token'] },
        where: {
            deleted: false
        }
    });

    for (const account of accounts) {
        const role = await Role.findOne({
            where: {
                id: account.dataValues.roleId,
                deleted: false
            }
        })
        account['role'] = role;
    }

    res.render(`admin/pages/accounts/index.pug`, {
        pageTitle: `Admin Accounts`,
        accounts
    })
}

// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('account_create')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const roles = await Role.findAll({
        where: {
            deleted: false
        }
    });

    res.render(`admin/pages/accounts/create.pug`, {
        pageTitle: 'New Admin Account',
        roles
    })
}

// [POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {

    if (!res.locals.role.permissions.includes('account_create')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const accountAdminObject = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        roleId: req.body.roleId,
        status: req.body.status
    }

    if (req.body.phone) {
        accountAdminObject['phone'] = req.body.phone;
    }

    if (req.body.avatar) {
        accountAdminObject['avatar'] = req.body.avatar;
    }

    await Admin.create(accountAdminObject);

    req['flash']('success', 'New account added!');
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);

}

// [GET] /admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('account_edit')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const accountId: string = `${req.params.id}`;

    try {
        const account = await Admin.findOne({
            attributes: { exclude: ['password', 'token'] },
            where: {
                id: accountId,
                deleted: false
            }
        });

        const roles = await Role.findAll({
            where: {
                deleted: false
            }
        })

        res.render(`admin/pages/accounts/edit.pug`, {
            account,
            roles,
            pageTitle: 'Edit Admin Account'
        });

    } catch (error) {
        //TODO: redirect to 404 page
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`)
    }
}

// [PATCH] /admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('account_edit')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }
    const accountId = `${req.params.id}`;

    const accountAdminObject = {
        fullName: req.body.fullName,
        email: req.body.email,
        roleId: req.body.roleId,
        status: req.body.status
    }

    if (req.body.phone) {
        accountAdminObject['phone'] = req.body.phone;
    }

    if (req.body.avatar) {
        accountAdminObject['avatar'] = req.body.avatar;
    }

    if (req.body.password) {
        accountAdminObject['password'] = md5(req.body.password);
    }

    await Admin.update(accountAdminObject, {
        where: {
            id: accountId,
            deleted: false
        }
    });

    req['flash']('success', 'The account was updated!');
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);

}

// [DELETE] /admin/accounts/delete/:id
export const deleteAccount = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('account_delete')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const accountId = `${req.params.id}`;

    await Admin.update(
        { deleted: true }, {
        where: {
            id: accountId
        }
    }
    )

    req['flash']('success', `Account id ${accountId} was deleted!`);
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

// [GET] /admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('account_view')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const accountId: string = `${req.params.id}`;

    try {
        const account = await Admin.findOne({
            attributes: { exclude: ['password', 'token'] },
            where: {
                id: accountId,
                deleted: false
            }
        });

        const role = await Role.findOne({
            where: {
                id: account.dataValues.roleId,
                deleted: false
            }
        })

        if (role) account['role'] = role

        res.render(`admin/pages/accounts/detail.pug`, {
            account,
            pageTitle: 'Detail Admin Account'
        });

    } catch (error) {
        //TODO: redirect to 404 page
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`)
    }
}