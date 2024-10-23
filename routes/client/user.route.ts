import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/user.controller";

router.get("/register", controller.register)

export const userRoutes: Router = router;