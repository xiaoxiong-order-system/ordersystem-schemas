import { z } from "zod";
import { CustomDishDetailInputSchema } from "./custom-dish.ts";

// 外卖配送下单（原 create-takeaway）：预约自取（order_type=takeaway）、立即取餐（order_type=takeaway_now）
// 与配送（order_type=delivery）同一个接口、同一张订单表 delivery_order

export const DeliveryOrderDishInputSchema = z.object({
  dish_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
  detail: CustomDishDetailInputSchema.optional(), // 自定义菜（custom_dish）选项，按分组嵌套，普通菜不传
});

const baseDeliveryOrderSchema = z.object({
  restaurant_id: z.number().int().positive(),
  contact_name: z.string().min(1),
  dishes: z.array(DeliveryOrderDishInputSchema).min(1),
  note: z.string().nullable().optional(),
});

// order_type=takeaway（预约自取）：不需要地址，pickup_time 必填，contact_phone / email 至少填一个
// order_type=takeaway_now（立即取餐，店内下单马上取走）：只要 contact_name，contact_phone / email 都可不填；
//   不传 pickup_time，数据库按 created_at 记录
// order_type=delivery 必须提供 postal_code + address，contact_phone/email 必填
// delivery_time 选填，不传视为"尽快送达"
// （数据库 delivery_order_contact_check 约束 + pickup_time NOT NULL 同样兜底这套规则）
export const CreateDeliveryOrderInputSchema = z.discriminatedUnion("order_type", [
  baseDeliveryOrderSchema.extend({
    order_type: z.literal("takeaway"),
    contact_phone: z.string().min(1).nullable().optional(),
    email: z.string().email().nullable().optional(),
    pickup_time: z.string().min(1), // ISO 8601
  }),
  baseDeliveryOrderSchema.extend({
    order_type: z.literal("takeaway_now"),
    contact_phone: z.string().min(1).nullable().optional(),
    email: z.string().email().nullable().optional(),
  }),
  baseDeliveryOrderSchema.extend({
    order_type: z.literal("delivery"),
    contact_phone: z.string().min(1),
    email: z.string().email(),
    postal_code: z.string().min(1),
    address: z.string().min(1),
    delivery_time: z.string().min(1).nullable().optional(), // ISO 8601
  }),
]).superRefine((data, ctx) => {
  if (data.order_type === "takeaway" && !data.contact_phone && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["contact_phone"],
      message: "contact_phone or email is required for takeaway",
    });
  }
});

export type DeliveryOrderDishInput = z.infer<typeof DeliveryOrderDishInputSchema>;
export type CreateDeliveryOrderInput = z.infer<typeof CreateDeliveryOrderInputSchema>;

export const CreateDeliveryOrderResponseSchema = z.object({
  order_id: z.number().int(),
  record_no: z.number().int(), // 自取（takeaway + takeaway_now 共用）与配送各自递增，自取单和配送单会重号
  order_type: z.enum(["takeaway", "takeaway_now", "delivery"]),
  status: z.string(),
  total_price: z.number(),
  created_at: z.string(),
  items: z.number().int(),
});

export type CreateDeliveryOrderResponse = z.infer<typeof CreateDeliveryOrderResponseSchema>;
