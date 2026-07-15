import { z } from "zod";
import { DishInputSchema } from "./create-order.ts";

export const MerchantCreateOrderInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  table_id: z.number().int().positive(),
  user_id: z.string().uuid().nullable().optional(),
  note_name: z.string().nullable().optional(),
  note_description: z.string().nullable().optional(),
  dishes: z.array(DishInputSchema).min(1),
  print_order: z.boolean(), // true 时调用 print-dinein-order，false 时不调用；完全覆盖 service_order_control.auto_print_order
});

export type MerchantCreateOrderInput = z.infer<typeof MerchantCreateOrderInputSchema>;

export const MerchantCreateOrderResponseSchema = z.object({
  order_id: z.number().int(),
  record_no: z.string(),
  status: z.string(),
  created_at: z.string(),
  items: z.number().int(),
});

export type MerchantCreateOrderResponse = z.infer<typeof MerchantCreateOrderResponseSchema>;
