import { Router } from "express";
import multer from "multer";

const router: Router = Router();
const upload = multer();

import * as controller from "../../controllers/admin/category.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

router.get("/", controller.index);

router.get(`/create`, controller.create);

router.post(
    `/create`,
    upload.single('image'),
    uploadCloud.uploadSingle,
    controller.createPost
);

router.get(`/edit/:id`, controller.edit);

router.patch(
    `/edit/:id`,
    upload.single('image'),
    uploadCloud.uploadSingle,
    controller.editPatch
);

router.delete(`/delete/:id`, controller.deleteCategory);

router.get(`/detail/:id`, controller.detail);

export const categoryRoutes: Router = router;