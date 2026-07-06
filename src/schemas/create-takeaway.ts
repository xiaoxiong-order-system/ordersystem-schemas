import { z } from "zod";

export const TakeawayDishInputSchema = z.object({
  dish_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

const baseTakeawaySchema = z.object({
  restaurant_id: z.number().int().positive(),
  contact_name: z.string().min(1),
  contact_phone: z.string().min(1),
  email: z.string().email(),
  dishes: z.array(TakeawayDishInputSchema).min(1),
  note: z.string().nullable().optional(),
});

// type=takeaway 不需要地址；type=delivery 必须提供 postal_code + address
export const CreateTakeawayInputSchema = z.discriminatedUnion("type", [
  baseTakeawaySchema.extend({
    type: z.literal("takeaway"),
    postal_code: z.string().optional(),
    address: z.string().optional(),
  }),
  baseTakeawaySchema.extend({
    type: z.literal("delivery"),
    postal_code: z.string().min(1),
    address: z.string().min(1),
  }),
]);

export type TakeawayDishInput = z.infer<typeof TakeawayDishInputSchema>;
export type CreateTakeawayInput = z.infer<typeof CreateTakeawayInputSchema>;

export const CreateTakeawayResponseSchema = z.object({
  order_id: z.number().int(),
  record_no: z.string(),
  type: z.enum(["takeaway", "delivery"]),
  status: z.string(),
  total_price: z.number(),
  created_at: z.string(),
  items: z.number().int(),
});

export type CreateTakeawayResponse = z.infer<typeof CreateTakeawayResponseSchema>;
