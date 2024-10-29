import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/home.controller";

router.get(`/welcome`, controller.welcome)

export const homeRoutes: Router = router;