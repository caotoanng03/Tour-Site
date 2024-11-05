import { Request, Response } from "express";
import Category from "../../models/category.model";
import { systemConfig } from "../../config/system";
const { Op } = require("sequelize");

// [GET] /admin/categories
export const index = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('category_view')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const categories = await Category.findAll({
        where: {
            deleted: false,
            status: "active"
        },
        raw: true
    });

    res.render("admin/pages/categories/index", {
        pageTitle: "Categories",
        categories
    });
};

// [GET] /admin/create
export const create = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('category_create')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    res.render(`admin/pages/categories/create`, {
        pageTitle: `Create New Category`
    });
};

// [POST] /admin/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('category_create')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    let { title, description, image, position, status } = req.body;

    // check if the category is already existed or not
    const existedCategory = await Category.findOne({
        where: {
            title: title
        }
    })

    if (existedCategory) {
        req['flash']('error', 'The category is already existed!');
        res.redirect('back');
        return;
    }

    const numberOfAllCategories = await Category.count({
        where: {
            deleted: false
        }
    });

    if (!position) {
        position = numberOfAllCategories + 1;
    }

    const categoryData = {
        title,
        position,
        status,
        image
    }

    // optional fields
    if (description) categoryData['description'] = description;
    if (req.body.image) categoryData['image'] = req.body.image

    await Category.create(categoryData);

    req['flash']('success', 'New category was created!');
    res.redirect(`/${systemConfig.prefixAdmin}/categories`);
};

// [GET] /admin/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('category_edit')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const categoryId = req.params.id;

    const category = await Category.findOne({
        where: {
            id: categoryId
        }
    });

    if (!category) {
        res.render(`errors/error.pug`, {
            code: 400,
            title: 'bad request'
        })
        return;
    }

    res.render(`admin/pages/categories/edit`, {
        pageTitle: `Edit Category ID: ${categoryId}`,
        category
    });
};

// [PATCH] /admin/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('category_edit')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const categoryId = req.params.id;

    let { title, description, image, position, status } = req.body;

    // check if the category is already existed or not
    const existedCategory = await Category.findOne({
        where: {
            [Op.and]: [
                { id: { [Op.not]: categoryId } },
                { title: title }
            ]
        }
    })

    if (existedCategory) {
        req['flash']('error', 'The category title is already existed!');
        res.redirect('back');
        return;
    }

    const categoryData = {
        title,
        position,
        status,
        image
    }

    // optional fields
    if (description) categoryData['description'] = description;
    if (image) categoryData['image'] = image;
    if (position) categoryData['position'] = position;

    await Category.update(categoryData, { where: { id: categoryId } });

    req['flash']('success', `The category id(${categoryId}) was updated!`);
    res.redirect(`/${systemConfig.prefixAdmin}/categories`);
};

// [DELETE] /admin/delete/:id
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('category_delete')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const categoryId = req.params.id;

    await Category.update(
        { deleted: true }, {
        where: {
            id: req.params.id
        }
    }
    );

    req['flash']('success', `The category id(${categoryId}) was deleted!`);
    res.redirect(`/${systemConfig.prefixAdmin}/categories`);
};

// [GET] /admin/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
    if (!res.locals.role.permissions.includes('category_view')) {
        res.render(`errors/error.pug`, {
            code: 403,
            title: 'Forbidden'
        })
        return;
    }

    const categoryId = req.params.id;

    const category = await Category.findOne({
        where: {
            id: categoryId
        }
    });

    if (!category) {
        res.render(`errors/error.pug`, {
            code: 400,
            title: 'bad request'
        })
        return;
    }

    res.render(`admin/pages/categories/detail`, {
        pageTitle: `Detail Category: ${category.dataValues.title}`,
        category
    });
};