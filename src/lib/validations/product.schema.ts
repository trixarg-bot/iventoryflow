import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z.string().max(500, "La descripción no puede exceder 500 caracteres").optional(),
  price: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .multipleOf(0.01, "El precio solo puede tener hasta 2 decimales"),
  active: z.boolean(),
});

export const updateProductSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
