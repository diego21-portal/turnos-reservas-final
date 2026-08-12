import { z } from "zod";

export const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "El id debe ser un ObjectId válido de MongoDB")
  .transform((value) => value.toLowerCase());

export const paginationSchema = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
};

export const booleanQuerySchema = z
  .enum(["true", "false"])
  .transform((value) => value === "true");
