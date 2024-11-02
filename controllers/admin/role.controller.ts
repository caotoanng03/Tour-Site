import { Request, Response } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";
import sequelize from "../../config/database";
import RolePermission from "../../models/roles_permissions.model";
import Permission from "../../models/permission.model";
import { Sequelize } from "sequelize";

// [GET] /admin/roles/
export const index = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('role_view')) {
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
    }) || [];

    res.render(`admin/pages/roles/index.pug`, {
        pageTitle: `Role Management`,
        roles
    })
}

// [GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('role_create')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    res.render(`admin/pages/roles/create.pug`, {
        pageTitle: 'Add New Role'
    })
}

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('role_create')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

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
    if (!res.locals.role.permissions.includes('role_edit')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

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
    if (!res.locals.role.permissions.includes('role_edit')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

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
    if (!res.locals.role.permissions.includes('role_view')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

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
    if (!res.locals.role.permissions.includes('role_delete')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

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

// [GET] /admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('roles_permissions')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    let roles = [];

    const roleRecords = await Role.findAll({
        attributes: ['id', 'title'],
        where: {
            deleted: false
        }
    });

    for (const role of roleRecords) {
        const id = role.dataValues.id;

        let roleItem = {
            id,
            title: role.dataValues.title
        }

        const permissionRecords = await sequelize.query(`
            SELECT rp.*, p.title
            FROM roles_permissions rp
            JOIN permissions p ON rp.permissionId = p.id
            WHERE rp.roleId = :id
        `, {
            replacements: { id },
            type: Sequelize['QueryTypes'].SELECT,
            raw: true
        });

        const permission = permissionRecords.map(permission => permission['title']);
        roleItem['permissions'] = permission;

        roles[roles.length] = roleItem;
    }

    res.render(`admin/pages/roles/permission.pug`, {
        pageTitle: 'Access Control',
        roles
    })
}


// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req, res: Response) => {
    if (!res.locals.role.permissions.includes('roles_permissions')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const roles = JSON.parse(req.body.permissions);

    for (const role of roles) {
        const roleId = role.id;
        const permissionsList = role.permissions.map(permission => `'${permission}'`).join(', ');

        // chen vao bang roles_permissions, trùng thì bỏ qua
        // if permissions is empty, then do nothing
        if (role.permissions.length > 0) {
            await sequelize.query(`
                INSERT IGNORE INTO roles_permissions (roleId, permissionId)
                SELECT :roleId, p.id
                FROM permissions p
                WHERE p.title IN (${permissionsList});
                `, {
                replacements: { roleId },
                raw: true
            });
        }

        // hard delete
        // xoá records không có trong mảng permissions
        if (role.permissions.length > 0) {
            await sequelize.query(`
                DELETE FROM roles_permissions
                WHERE roleId = :roleId
                AND permissionId NOT IN (
                    SELECT id FROM permissions WHERE title IN (${permissionsList})
                );
                `, {
                replacements: { roleId },
                raw: true
            })
        } else {
            // permissions is []
            await RolePermission.destroy({
                where: {
                    roleId: roleId
                }
            });
        }
    }

    req.flash('success', 'Permissions applied!');
    res.redirect(`back`);
}


