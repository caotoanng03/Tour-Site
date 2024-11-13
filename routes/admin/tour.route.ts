import { Router } from "express";
import multer from "multer";

const router: Router = Router();

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
const upload = multer();

import * as controller from "../../controllers/admin/tour.controller";
import * as validate from "../../validates/admin/tour.validate";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.fields([
        { name: 'images', maxCount: 10 }
    ]),
    uploadCloud.uploadFields,
    validate.createPost,
    controller.createPost
);


router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.fields(
        [{ name: 'images', maxCount: 10 }]
    ),
    uploadCloud.uploadFields,
    controller.editPatch
);

router.delete(`/delete/:id`, controller.deleteTour);

router.get(`/detail/:id`, controller.detail);

router.get(`/search/:type`, controller.search);

export const tourRoutes: Router = router;