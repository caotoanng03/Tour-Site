import { Router } from "express";
import multer from "multer";

const router: Router = Router();
const upload = multer();

import * as controller from "../../controllers/client/user-profile.controller";
import * as uploadCloud from "../../middlewares/client/uploadCloud.middleware";

router.get(`/`, controller.profile);

router.get(`/edit`, controller.editProfile);

router.post(
    `/edit`,
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    controller.editProfilePost
)

export const userProfileRoutes: Router = router;