import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/home.controller";

router.get(`/`, controller.welcome)

export const homeRoutes: Router = router;