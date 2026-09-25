import { z } from "zod";
import { DishInputSchema } from "./create-order.ts";

// 仅 merchant-create-order 使用：允许上传 price/discount 覆盖数据库菜品价，
// 不并入 create-order.ts 的共享 DishInputSchema，避免顾客端下单也能自定义价格。
// 是否真正采信由函数内部按调用者是否持有 pos.price.override 权限决定，无权限时静默忽略。
export const MerchantDishInputSchema = DishInputSchema.extend({
  // 整行单价：自定义菜的配菜（加料）价已含在内，后端不再叠加。
  // 不传 = 后端计算：dish_price 解析出的当前生效价 + 配菜价
  price:    z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(), // 不传 = 用 dish_price 解析出的当前生效折扣；不支持传 null 清除
  // true = 员工在下单界面手动点了"调整价格"改过这道菜的 price/discount；
  // false/不传 = price/discount 就算有值也只是前端自动带上的当前计算价（不是人工改价）。
  // 仅用于后端审计日志（price_overrides）判断要不要记"改价"，不影响是否采信 price/discount
  // 本身——只要有 pos.price.override 权限，price/discount 一律采信，这个标记只管日志语义。
  price_overridden: z.boolean().optional(),
  // 不传 = 该道菜属于订单自身 restaurant_id；传则必须是订单 restaurant_id 的子餐厅
  // （restaurant_business_information.parent_id = 订单 restaurant_id），且 dish_id 须属于这个子餐厅，
  // 用于同一堂食订单内混合下单多个子品牌（子餐厅）的菜品
  restaurant_id: z.number().int().positive().optional(),
});

export const MerchantCreateOrderInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  table_id: z.number().int().positive(),
  // 计价渠道：决定按 dish_price 里哪个 sale_channel 解析生效价/折扣，以及自定义菜
  // 加料价取 custom_dish_item 的哪一列。
  // **必传、故意不给默认值**——POS 界面让员工选"计价方式"，后端无从替前端猜，
  // 以前硬编码 "dinein" 会让"选了外卖计价"的订单回退到堂食基准价行（没配堂食价的
  // 菜品那行 price 是 0），静默出 0 元订单。不传直接 400。
  //
  // 这里只校验"是个非空字符串"，**不在 Zod 里写死可选值**：合法取值是
  // sale_channel 表里的 code（目前 dinein/delivery，但那是数据、不是代码常量，
  // 新增渠道时不应该还要改这份 schema）。实际取值合法性由函数内查 sale_channel
  // 表校验，不匹配返回 400 并附带当前支持的 code 列表。
  sale_channel: z.string().min(1),
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
