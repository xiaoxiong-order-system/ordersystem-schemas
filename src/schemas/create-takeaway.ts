import { z } from "zod";
import { CustomDishDetailInputSchema } from "./custom-dish.ts";

export const TakeawayDishInputSchema = z.object({
  dish_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
  detail: CustomDishDetailInputSchema.optional(), // 自定义菜（custom_dish）选项，按分组嵌套，普通菜不传
});

const baseTakeawaySchema = z.object({
  restaurant_id: z.number().int().positive(),
  contact_name: z.string().min(1),
  dishes: z.array(TakeawayDishInputSchema).min(1),
  note: z.string().nullable().optional(),
});

// type=takeaway 不需要地址，contact_phone/email 选填（表已允许 NULL）
// type=delivery 必须提供 postal_code + address，contact_phone/email 仍必填
export const CreateTakeawayInputSchema = z.discriminatedUnion("type", [
  baseTakeawaySchema.extend({
    type: z.literal("takeaway"),
    contact_phone: z.string().min(1).nullable().optional(),
    email: z.string().email().nullable().optional(),
    postal_code: z.string().optional(),
    address: z.string().optional(),
  }),
  baseTakeawaySchema.extend({
    type: z.literal("delivery"),
    contact_phone: z.string().min(1),
    email: z.string().email(),
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
