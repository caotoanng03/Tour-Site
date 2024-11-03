import { Router } from "express";
import multer from "multer";

const router: Router = Router();
const upload = multer();

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import * as controller from "../../controllers/admin/my-account.controller";
import * as validate from "../../validates/admin/my-admin.validate";

router.get('/', controller.index);

router.get('/edit', controller.edit);

router.patch(
    '/edit',
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    validate.editPatch,
    controller.editPatch
)

export const myAccountRoutes: Router = router;