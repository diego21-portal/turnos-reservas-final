import { Router } from "express";
import {
  addServiceToBooking,
  clearBookingServices,
  createBooking,
  deleteBooking,
  getBookingById,
  getPopulatedBooking,
  listBookings,
  removeServiceFromBooking,
  updateBooking,
  updateBookingServiceQuantity
} from "../controllers/booking.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  bookingIdParamsSchema,
  bookingQuerySchema,
  bookingServiceParamsSchema,
  createBookingSchema,
  quantitySchema,
  updateBookingSchema
} from "../schemas/booking.schemas.js";

export const bookingRouter = Router();

bookingRouter.get(
  "/",
  validate({ query: bookingQuerySchema }),
  listBookings
);

bookingRouter.post(
  "/",
  validate({ body: createBookingSchema }),
  createBooking
);

bookingRouter.get(
  "/:bookingId/populated",
  validate({ params: bookingIdParamsSchema }),
  getPopulatedBooking
);

bookingRouter.post(
  "/:bookingId/services/:serviceId",
  validate({ params: bookingServiceParamsSchema, body: quantitySchema }),
  addServiceToBooking
);

bookingRouter.put(
  "/:bookingId/services/:serviceId",
  validate({ params: bookingServiceParamsSchema, body: quantitySchema }),
  updateBookingServiceQuantity
);

bookingRouter.patch(
  "/:bookingId/services/:serviceId",
  validate({ params: bookingServiceParamsSchema, body: quantitySchema }),
  updateBookingServiceQuantity
);

bookingRouter.delete(
  "/:bookingId/services/:serviceId",
  validate({ params: bookingServiceParamsSchema }),
  removeServiceFromBooking
);

bookingRouter.delete(
  "/:bookingId/services",
  validate({ params: bookingIdParamsSchema }),
  clearBookingServices
);

bookingRouter.get(
  "/:bookingId",
  validate({ params: bookingIdParamsSchema }),
  getBookingById
);

bookingRouter.patch(
  "/:bookingId",
  validate({ params: bookingIdParamsSchema, body: updateBookingSchema }),
  updateBooking
);

bookingRouter.delete(
  "/:bookingId",
  validate({ params: bookingIdParamsSchema }),
  deleteBooking
);
