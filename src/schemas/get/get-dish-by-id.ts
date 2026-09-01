import { z } from "zod";

// get-dish-by-id — 按 restaurant_id + dish_id 获取单道菜的完整信息
//
// Method: GET /functions/v1/get-dish-by-id?restaurant_id=1&dish_id=101&language=zh
// 调用方: 管理端（商家后台）——已核实顾客前端不调用此接口，仅 admin / 该餐厅
//         或父餐厅有 user_restaurant_role 的用户可访问，无公开访问分支
// 认证: 必须。不传 Authorization → 401；token 无效 → 401；已登录但不满足上述
//       身份 → 403
//
// 不受状态过滤（能查 draft/closed 等任意状态），标签关联（dish_tag/view_tag）
// 与 dish_price 里 enable=false 的行也原样返回，便于管理端查看/恢复已禁用的配置。
//
// dish_price 字段：该菜品完整的价格排期原始数据（基准价行 + 全部分时段覆盖
// 行，含 start_time/end_time/weekday，含 enable=false 的行），给管理端价格
// 编辑面板展示/编辑用。不返回"此刻生效价"（resolveDishPrices，见
// _shared/dishPrice.ts）——那是下单接口的职责，管理端只需要看到完整排期本身，
// dish 表也已不存任何价格字段
//
// 错误码：400（缺少 restaurant_id/dish_id）/ 401（未登录）/ 403（已登录但
// 无该餐厅权限）/ 404（菜品不存在）/ 500（服务器错误）

export const GetDishByIdQuerySchema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  dish_id: z.coerce.number().int().positive(),
  language: z.string().optional(), // 逗号分隔，默认 zh
});

export type GetDishByIdQuery = z.infer<typeof GetDishByIdQuerySchema>;

const multilinguaRow = z.object({ language_code: z.string(), text: z.string().nullable() });

export const DishTagEntrySchema = z.object({
  tag: z.object({
    id: z.number().int(),
    text: z.string(),
    image: z.string().nullable(),
    tag_multilingua: z.array(multilinguaRow),
  }),
});

export const DishGroupEntrySchema = z.object({
  id: z.number().int(),
  enable: z.boolean(),
  image: z.string().nullable(),
  group_name_multilingua: z.array(multilinguaRow),
  group_description_multilingua: z.array(multilinguaRow),
});

export const ActivityDishEntrySchema = z.object({
  enable: z.boolean(),
  activity: z.object({ id: z.string(), text: z.string(), enable: z.boolean() }).nullable(),
});

export const DishPriceEntrySchema = z.object({
  id: z.number().int(),
  sale_channel: z.enum(["dinein", "delivery"]).nullable(), // NULL = 不限渠道
  price: z.number().nullable(),                            // 基准价行必填；覆盖行可为空
  discount: z.number().nullable(),
  weekday: z.string().nullable(),                           // NULL = 基准价行；否则 'monday'..'sunday'/'holiday'
  start_time: z.string().nullable(),                        // "HH:MM:SS"；基准价行为 NULL
  end_time: z.string().nullable(),
  enable: z.boolean(),
});

export const GetDishByIdResponseSchema = z.object({
  id: z.number().int(),
  sku: z.string(),
  status: z.string(),
  restaurant_id: z.number().int(),
  image: z.string().nullable(),
  custom_dish_id: z.number().int().nullable(),
  category_id: z.number().int().nullable(),
  rates: z.number().int(),
  likes: z.number().int(),
  order_limit: z.number().int().nullable(),
  table_limit: z.number().int().nullable(),
  print_text: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),

  dish_relation: z.array(z.object({
    id: z.number().int(),
    other_dish_id: z.number().int(),
    relation_type: z.string(),
  })),
  pt_tax_rate: z.object({ code: z.string(), rate: z.number(), text: z.string() }).nullable(),
  sale_channel: z.array(z.string()),
  dish_price: z.array(DishPriceEntrySchema),

  dish_name_multilingua: z.array(multilinguaRow),
  dish_description_multilingua: z.array(multilinguaRow),
  yellow_king_internal_medicine: z.array(multilinguaRow),

  category: z.object({
    id: z.number().int(),
    text: z.string(),
    enable: z.boolean(),
    category_multilingua: z.array(multilinguaRow),
  }).nullable(),

  print_tag: z.array(DishTagEntrySchema),
  allergens_tag: z.array(DishTagEntrySchema),
  property_tag: z.array(DishTagEntrySchema),
  dish_groups: z.array(DishGroupEntrySchema),
  view_tag: z.array(DishTagEntrySchema),
  activity_dish: z.array(ActivityDishEntrySchema),

  // custom_dish_id 非空时才有内容；结构较深（含 custom_dish_group/custom_dish_item），
  // 前端按需读取具体字段，这里不做逐层强校验
  custom_dish: z.unknown().nullable().optional(),
});

export type GetDishByIdResponse = z.infer<typeof GetDishByIdResponseSchema>;
