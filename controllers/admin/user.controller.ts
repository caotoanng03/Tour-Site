import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import md5 from "md5";
import User from "../../models/user.model";
import { removeDiacritics as removeDiacriticsHelper } from "../../helpers/textUtils";
import { Op } from "sequelize";

// [GET] /admin/users
export const index = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('user_view')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const users = await User.findAll({
        where: {
            deleted: false
        }
    });

    res.render(`admin/pages/users/index.pug`, {
        pageTitle: 'Customers',
        users
    })
}

// [GET] /admin/users/create
export const create = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('user_create')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    res.render(`admin/pages/users/create`, {
        pageTitle: 'New Customer Account'
    })
}

// [POST] /admin/users/create
export const createPost = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('user_create')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const { fullName, email, password, status } = req.body;

    const user = await User.findOne({
        where: {
            email: email
        }
    });

    if (user) {
        req['flash']('error', 'Email is already existed');
        res.redirect(`back`);
        return;
    }

    const userObject = {
        fullName,
        email,
        password: md5(password),
        status
    }

    if (req.body.phone) {
        userObject['phone'] = req.body.phone;
    }

    if (req.body.citizen) {
        userObject['citizen'] = req.body.citizen;
    }

    if (req.body.avatar) {
        userObject['avatar'] = req.body.avatar;
    }

    await User.create(userObject);

    req['flash']('success', 'Created new user!');
    res.redirect(`/${systemConfig.prefixAdmin}/users`);

}

// [GET] /admin/users/edit/:id
export const edit = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('user_edit')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const userId = req.params.id;

    const user = await User.findOne({
        attributes: { exclude: ['password', 'token'] },
        where: {
            id: userId,
            deleted: false
        }
    });

    if (!user) {
        res.render(`errors/error.pug`, {
            code: 400,
            title: 'bad request'
        })
        return;
    }

    res.render(`admin/pages/users/edit`, {
        pageTitle: `Edit Cusomter ID: ${userId}`,
        user
    })
}

// [PATCH] /admin/users/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('user_edit')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const userId = req.params.id;

    const { fullName, email, status } = req.body;

    const userObject = {
        fullName,
        email,
        status
    }

    const password = req.body.password;
    if (password) {
        userObject['password'] = md5(password);
    }

    if (req.body.phone) {
        userObject['phone'] = req.body.phone;
    }

    if (req.body.citizen) {
        userObject['citizen'] = req.body.citizen;
    }

    if (req.body.avatar) {
        userObject['avatar'] = req.body.avatar;
    }

    await User.update(userObject, {
        where: {
            id: userId,
            deleted: false
        }
    })

    req['flash']('success', 'The user info is updated');
    res.redirect(`/${systemConfig.prefixAdmin}/users`);
}

// [DELETE] /admin/users/delete/:id
export const deleteUser = async (req: Request, res: Response) => {
    if (!res.locals.role.permissions.includes('user_delete')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const userId = req.params.id;

    await User.update(
        { deleted: true },
        { where: { id: userId } }
    )

    req['flash']('success', `The user id(${userId}) was deleted!`);
    res.redirect(`/${systemConfig.prefixAdmin}/users`);
}

// [GET] /admin/users/detail/:id
export const detail = async (req: Request, res: Response) => {
    const userId = req.params.id;

    const user = await User.findOne({
        attributes: { exclude: ['password', 'token'] },
        where: {
            id: userId,
            deleted: false
        }
    });

    if (!user) {
        res.render(`errors/error.pug`, {
            code: 400,
            title: 'bad request'
        })
        return;
    }

    res.render(`admin/pages/users/detail`, {
        pageTitle: `Detail Customer ID: ${userId}`,
        user
    });
}

// [GET] /admin/users/search/:type
export const search = async (req: Request, res: Response): Promise<void> => {
    let searchedUsers = [];

    const keyword = req.query.keyword;
    const type = req.params.type;

    if (keyword) {
        const keywordRegex = removeDiacriticsHelper(keyword);

        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { fullName: { [Op.like]: `%${keywordRegex}%` } },
                    { email: { [Op.like]: `%${keywordRegex}%` } }
                ],
                deleted: false
            },
            attributes: ['id', 'fullName', 'email']
        });

        searchedUsers = users;
    }

    switch (type) {
        case "result":
            break;
        case "suggest":
            res.json({
                code: 200,
                message: "Success!",
                users: searchedUsers
            });
            break;
        default:
            break;
    }
}