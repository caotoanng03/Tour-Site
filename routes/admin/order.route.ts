import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/order.controller";

router.get(`/`, controller.index);

router.get(`/detail/:id`, controller.detail);

router.get(`/create`, controller.create);

router.post(`/create`, controller.createPost);

router.get(`/edit/:id`, controller.edit);

router.patch(`/edit/:id`, controller.editPatch);

router.delete(`/delete/:id`, controller.deleteOrder);

export const orderRoutes: Router = router;