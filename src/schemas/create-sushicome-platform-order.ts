import { z } from "zod";

// SushiCome 直接下单（不经 Shopify）落地到 external_platform_order（platform = 'sushicome'）。
// 订单号由函数自行生成，调用方不传；商品是 SushiCome 自己的 SKU，不对应 dish 目录。

const SushicomePlatformOrderItemSchema = z.object({
  sku: z.string().nullable().optional(),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  // 单价
  price: z.number().nonnegative(),
  // 规格 / 加料等原始属性，原样存 properties
  properties: z.unknown().optional(),
});

export const CreateSushicomePlatformOrderInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  fulfillment_type: z.enum(["pickup", "delivery"]),
  payment_status: z.enum(["unpaid", "paid"]).optional(),
  contact_name: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  pickup_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "pickup_date must be YYYY-MM-DD").nullable().optional(),
  pickup_time: z.string().nullable().optional(),
  delivery_time: z.string().datetime({ offset: true }).nullable().optional(),
  note: z.string().nullable().optional(),
  // 不传默认 EUR
  currency: z.string().length(3).optional(),
  // 不传时按 items 的 price * quantity 求和；传了以调用方为准（可含配送费 / 折扣）
  total_price: z.number().nonnegative().optional(),
  items: z.array(SushicomePlatformOrderItemSchema).min(1),
}).superRefine((v, ctx) => {
  if (v.fulfillment_type === "delivery" && !v.address) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["address"], message: "address is required for delivery" });
  }
});
export type CreateSushicomePlatformOrderInput = z.infer<typeof CreateSushicomePlatformOrderInputSchema>;

export const CreateSushicomePlatformOrderResponseSchema = z.object({
  ok: z.literal(true),
  order_id: z.number().int(),
  // 函数生成的订单号，全局递增，如 "SC0001"（platform_order_name 同值）
  platform_order_id: z.string(),
  platform_order_name: z.string(),
  restaurant_id: z.number().int(),
  total_price: z.number(),
});
export type CreateSushicomePlatformOrderResponse = z.infer<typeof CreateSushicomePlatformOrderResponseSchema>;
