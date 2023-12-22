import { Router, Request, Response } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/tour.controller";

router.get("/:slugCategory", controller.getToursBaseOnCategrorySlug);

router.get("/detail/:slugTour", controller.detail);

export const tourRoutes: Router = router;