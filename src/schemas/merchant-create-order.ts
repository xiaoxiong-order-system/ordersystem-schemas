import { z } from "zod";
import { DishInputSchema } from "./create-order.ts";

// 仅 merchant-create-order 使用：允许上传 price/discount 覆盖数据库菜品价，
// 不并入 create-order.ts 的共享 DishInputSchema，避免顾客端下单也能自定义价格。
// 是否真正采信由函数内部按调用者是否持有 pos.price.override 权限决定，无权限时静默忽略。
export const MerchantDishInputSchema = DishInputSchema.extend({
  price:    z.number().min(0).optional(),         // 不传 = 用 dish.price
  discount: z.number().min(0).max(100).optional(), // 不传 = 用 dish.discount；不支持传 null 清除
  // 不传 = 该道菜属于订单自身 restaurant_id；传则必须是订单 restaurant_id 的子餐厅
  // （restaurant_business_information.parent_id = 订单 restaurant_id），且 dish_id 须属于这个子餐厅，
  // 用于同一堂食订单内混合下单多个子品牌（子餐厅）的菜品
  restaurant_id: z.number().int().positive().optional(),
});

export const MerchantCreateOrderInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  table_id: z.number().int().positive(),
  user_id: z.string().uuid().nullable().optional(),
  note_name: z.string().nullable().optional(),
  note_description: z.string().nullable().optional(),
  dishes: z.array(MerchantDishInputSchema).min(1),
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
