import { z } from "zod";
import { CustomDishDetailInputSchema } from "./custom-dish.ts";

export const DishInputSchema = z.object({
  dish_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
  note: z.string().nullable().optional(),
  detail: CustomDishDetailInputSchema.optional(), // 自定义菜（custom_dish）选项，按分组嵌套，普通菜不传
});

export const CreateOrderInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  table_id: z.number().int().positive(),
  user_id: z.string().uuid().nullable().optional(),
  note_name: z.string().nullable().optional(),
  note_description: z.string().nullable().optional(),
  dishes: z.array(DishInputSchema).min(1),
  // 桌台点餐密码：餐厅开了 service_order_control.table_order_use_password、桌台当前有密码且密码已返回过时必填，
  // 缺少返回 403 TABLE_PASSWORD_REQUIRED，错误返回 403 TABLE_PASSWORD_INVALID；
  // 没开开关、或本场开台的第一单（密码还没返回过）不用传
  password: z.string().max(32).nullable().optional(),
});

export type DishInput = z.infer<typeof DishInputSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;

export const CreateOrderResponseSchema = z.object({
  order_id: z.number().int(),
  record_no: z.string(),
  status: z.string(),
  created_at: z.string(),
  items: z.number().int(),
  // 桌台点餐密码：本场开台第一次返回时是 4 位数字（这一单不用传密码），其它情况为 null；
  // 前端拿到后展示给顾客并保存，之后下单带上 password
  table_password: z.string().nullable(),
});

export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;
