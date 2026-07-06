import { z } from "zod";

export const GetTableOrdersQuerySchema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  table_id: z.coerce.number().int().positive(),
  since: z.string().optional(), // ISO 时间戳，增量拉取（updated_at 大于此值）
  lang: z.string().optional(), // 覆盖菜品名称的语言代码
});

export type GetTableOrdersQuery = z.infer<typeof GetTableOrdersQuerySchema>;

export const OrderRowSchema = z.object({
  id: z.number().int(),
  restaurant_id: z.number().int(),
  record_no: z.string(),
  status: z.string(),
  note_name: z.string().nullable(),
  note_description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const OrderItemRowSchema = z.object({
  id: z.number().int(),
  order_id: z.number().int(),
  dish_id: z.number().int(),
  dish_sku: z.string(),
  name: z.string().nullable(),
  price: z.number(),
  discount: z.number().nullable(),
  quantity: z.number().int(),
  note: z.string().nullable(),
  status: z.string(),
  parent_item_id: z.number().int().nullable(),
  updated_at: z.string(),
});

export const PeoplePriceEntrySchema = z.object({
  people_type_id: z.number().int(),
  text: z.string(),
  count: z.number(),
  price: z.number(),
  subtotal: z.number(),
});

export const PeoplePricingSchema = z.object({
  dining_mode: z.string(),
  is_holiday: z.boolean(),
  weekday: z.string(),
  prices: z.array(PeoplePriceEntrySchema),
  total: z.number(),
});

export const GetTableOrdersResponseSchema = z.object({
  table: z.object({
    id: z.number().int(),
    status: z.string(),
    start_time: z.number().int().nullable(),
  }),
  restaurants: z.array(z.number().int()), // 父餐厅 + 所有子餐厅 id
  orders: z.array(OrderRowSchema),
  order_items: z.array(OrderItemRowSchema),
  people_pricing: PeoplePricingSchema.nullable(),
  fetched_at: z.string(),
});

export type GetTableOrdersResponse = z.infer<typeof GetTableOrdersResponseSchema>;
