import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { bookingIdParamsSchema } from "../schemas/booking.schemas.js";
import {
  renderBooking,
  renderRealtimeServices,
  renderServices
} from "../controllers/view.controller.js";

export const viewRouter = Router();

viewRouter.get("/", (_req, res) => res.redirect("/services"));
viewRouter.get("/services", renderServices);
viewRouter.get("/realtime-services", renderRealtimeServices);
viewRouter.get(
  "/bookings/:bookingId",
  validate({ params: bookingIdParamsSchema }),
  renderBooking
);
