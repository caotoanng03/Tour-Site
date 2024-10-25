import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/user.controller";
import * as validate from "../../validates/client/user.validate";

router.get("/register", controller.register)

router.post(
    `/register`,
    validate.registerPost,
    controller.registerPost
)

router.post(
    `/login`,
    validate.loginPost,
    controller.loginPost
)

router.get(
    `/logout`,
    controller.logout
)

export const userRoutes: Router = router;