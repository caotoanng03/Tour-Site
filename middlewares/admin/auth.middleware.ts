import { Request, Response, NextFunction } from "express";
import { systemConfig } from "../../config/system";
import Admin from "../../models/admin.model";
import Role from "../../models/role.model";
import sequelize from "../../config/database";
import { Sequelize } from "sequelize";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const account = await Admin.findOne({
        attributes: { exclude: ['password', 'token'] },
        where: {
            token: token,
            deleted: false,
            status: 'active'
        }
    });

    if (!account) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const roleId = account.dataValues.roleId;

    const roleRecord = await Role.findOne({
        where: {
            id: roleId,
            deleted: false
        }
    })

    const role = {
        id: roleId,
        title: roleRecord.dataValues.title,
        description: roleRecord.dataValues.description
    }

    const permissionRecords = await sequelize.query(`
        SELECT p.title
        FROM roles_permissions rp
        JOIN permissions p ON rp.permissionId = p.id
        WHERE roleId = :roleId
        `, {
        replacements: { roleId },
        raw: true,
        type: Sequelize['QueryTypes'].SELECT
    }
    );

    const permissions = permissionRecords.map(e => e['title']);
    if (permissions.length > 0) role['permissions'] = permissions;

    res.locals.admin = account;
    res.locals.role = role;

    next();
}