import { z } from "zod";
import {
  booleanQuerySchema,
  mongoIdSchema,
  paginationSchema
} from "./common.schemas.js";

const bookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "completed"
]);

const bookingServiceInputSchema = z.object({
  serviceId: mongoIdSchema,
  quantity: z.coerce.number().int().min(1).max(100).default(1)
});

export const createBookingSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerEmail: z.string().trim().email().max(160),
  scheduledAt: z.coerce.date(),
  status: bookingStatusSchema.optional().default("pending"),
  notes: z.string().trim().max(500).optional().default(""),
  services: z.array(bookingServiceInputSchema).max(50).optional().default([])
});

export const updateBookingSchema = z
  .object({
    customerName: z.string().trim().min(2).max(100).optional(),
    customerEmail: z.string().trim().email().max(160).optional(),
    scheduledAt: z.coerce.date().optional(),
    status: bookingStatusSchema.optional(),
    notes: z.string().trim().max(500).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar"
  });

export const bookingIdParamsSchema = z.object({
  bookingId: mongoIdSchema
});

export const bookingServiceParamsSchema = z.object({
  bookingId: mongoIdSchema,
  serviceId: mongoIdSchema
});

export const quantitySchema = z.object({
  quantity: z.coerce.number().int().min(1).max(100)
});

export const bookingQuerySchema = z.object({
  ...paginationSchema,
  status: bookingStatusSchema.optional(),
  populate: booleanQuerySchema.optional().default(false)
});
