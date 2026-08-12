import { z } from "zod";
import {
  booleanQuerySchema,
  mongoIdSchema,
  paginationSchema
} from "./common.schemas.js";

const serviceFields = {
  name: z.string().trim().min(3).max(80),
  description: z.string().trim().min(5).max(500),
  category: z.string().trim().min(2).max(60),
  price: z.coerce.number().min(0),
  duration: z.coerce.number().int().min(1),
  available: z.boolean()
};

export const createServiceSchema = z.object({
  ...serviceFields,
  available: serviceFields.available.optional().default(true)
});

export const updateServiceSchema = z
  .object({
    name: serviceFields.name.optional(),
    description: serviceFields.description.optional(),
    category: serviceFields.category.optional(),
    price: serviceFields.price.optional(),
    duration: serviceFields.duration.optional(),
    available: serviceFields.available.optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar"
  });

export const serviceIdParamsSchema = z.object({
  serviceId: mongoIdSchema
});

export const serviceQuerySchema = z
  .object({
    ...paginationSchema,
    category: z.string().trim().min(1).optional(),
    available: booleanQuerySchema.optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    sort: z.enum(["asc", "desc"]).optional(),
    search: z.string().trim().min(1).max(100).optional()
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "minPrice no puede ser mayor que maxPrice",
      path: ["minPrice"]
    }
  );
