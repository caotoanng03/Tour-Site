import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/category.controller";

router.get("/", controller.index);

export const categoryRoutes: Router = router;