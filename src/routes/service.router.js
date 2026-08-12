import { Router } from "express";
import {
  createService,
  deleteService,
  getServiceById,
  listServices,
  updateService
} from "../controllers/service.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createServiceSchema,
  serviceIdParamsSchema,
  serviceQuerySchema,
  updateServiceSchema
} from "../schemas/service.schemas.js";

export const serviceRouter = Router();

serviceRouter.get(
  "/",
  validate({ query: serviceQuerySchema }),
  listServices
);

serviceRouter.post(
  "/",
  validate({ body: createServiceSchema }),
  createService
);

serviceRouter.get(
  "/:serviceId",
  validate({ params: serviceIdParamsSchema }),
  getServiceById
);

serviceRouter.put(
  "/:serviceId",
  validate({ params: serviceIdParamsSchema, body: updateServiceSchema }),
  updateService
);

serviceRouter.patch(
  "/:serviceId",
  validate({ params: serviceIdParamsSchema, body: updateServiceSchema }),
  updateService
);

serviceRouter.delete(
  "/:serviceId",
  validate({ params: serviceIdParamsSchema }),
  deleteService
);
