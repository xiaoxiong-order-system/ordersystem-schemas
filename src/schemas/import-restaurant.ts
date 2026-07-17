import { z } from "zod";
import { ExportRestaurantDataSchema } from "./export-restaurant.ts";

export const ImportRestaurantInputSchema = z.object({
  // 用 code 而不是自增 id 匹配目标餐厅——id 调用方不可控/不可预期，
  // code 是调用方自己定的、可预期。餐厅必须已通过 create-restaurant 建好。
  restaurant_code: z.string().min(1),
  parent_id: z.number().int().positive().optional(),
  // 必须显式传 true：按 code 查到餐厅已存在时，不传 true 会被拒绝（409），
  // 不会静默地把新数据叠加到旧数据上。
  overwrite: z.literal(true),
  data: ExportRestaurantDataSchema,
});
export type ImportRestaurantInput = z.infer<typeof ImportRestaurantInputSchema>;

export const ImportRestaurantResponseSchema = z.object({
  ok: z.literal(true),
  restaurant_id: z.number().int(),
  sub_restaurants: z.array(z.object({
    restaurant_code: z.string(),
    restaurant_id: z.number().int(),
  })),
});
export type ImportRestaurantResponse = z.infer<typeof ImportRestaurantResponseSchema>;
