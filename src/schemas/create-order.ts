import { z } from "zod";

export const DishInputSchema = z.object({
  dish_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
  note: z.string().nullable().optional(),
});

export const CreateOrderInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  table_id: z.number().int().positive(),
  user_id: z.string().uuid().nullable().optional(),
  note_name: z.string().nullable().optional(),
  note_description: z.string().nullable().optional(),
  dishes: z.array(DishInputSchema).min(1),
});

export type DishInput = z.infer<typeof DishInputSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;

export const CreateOrderResponseSchema = z.object({
  order_id: z.number().int(),
  record_no: z.string(),
  status: z.string(),
  created_at: z.string(),
  items: z.number().int(),
});

export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;
