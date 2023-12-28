import { Router } from "express";
import multer from "multer";

const router: Router = Router();

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
const upload = multer();

import * as controller from "../../controllers/admin/tour.controller";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.fields([
        { name: 'images', maxCount: 10 }
    ]),
    uploadCloud.uploadFields,
    controller.createPost
);

export const tourRoutes: Router = router;