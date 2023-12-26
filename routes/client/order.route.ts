import { Router } from "express";

const router: Router = Router();

import * as controller from "../../controllers/client/order.controller";

router.post("/", controller.order);

export const orderRoutes: Router = router;