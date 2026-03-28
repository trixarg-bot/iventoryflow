import { z } from "zod";

export const movementSchema = z.object({
  product_id: z
    .number()
    .int()
    .positive("Debe seleccionar un producto válido"),
  type: z.enum(["in", "out"]),
  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),
  notes: z.string().max(300, "Las notas no pueden exceder 300 caracteres").optional(),
});

export type MovementInput = z.infer<typeof movementSchema>;
