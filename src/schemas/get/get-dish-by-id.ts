import { z } from "zod";

// get-dish-by-id — 按 restaurant_id + dish_id 获取单道菜的完整信息
//
// Method: GET /functions/v1/get-dish-by-id?restaurant_id=1&dish_id=101&language=zh
// 调用方: 通用（客户端/管理端都用）
// 认证: 可选。不传 Authorization 视为公开访问；传了且该用户在这家餐厅（或其
//       父餐厅，子餐厅场景）有 user_restaurant_role 记录、或是平台 admin，
//       视为特权访问
//
// 公开访问 vs 特权访问的区别：
// - 公开访问只能查 status = published/sold_out 的菜，不存在则 404；返回字段
//   不含 category_id/print_text/print_tag，dish_tag 会过滤掉 enable=false
//   的关联和标签本身；dish_price 只包含 enable=true 的行（应用层过滤，
//   查询走 service role 会绕过 RLS）
// - 特权访问不受状态过滤（能查 draft/closed 等任意状态），返回上述全部字段，
//   且 enable=false 的标签关联/dish_price 行也会返回（管理端要能看到/恢复
//   已禁用的配置）
//
// 分时段生效价（effective_price 等 4 个字段）：按 dish_price 表（唯一权威价格
// 来源）+ 餐厅所在地本地时间解析出的"此刻生效"的价格/折扣。dish 表已不存
// 价格字段，没有"原始 price/delivery_price"可返回，前端展示菜品详情价格
// 一律用 effective_* 系列
//
// dish_price 字段：该菜品完整的价格排期原始数据（基准价行 + 全部分时段覆盖
// 行，含 start_time/end_time/weekday）。查询用 service role 会绕过 RLS，
// 是否看得到 enable=false 的行由边缘函数按 isPrivileged 手动过滤（不是靠
// RLS）：公开访问只返回 enable=true 的行，特权访问能看到全部（含已禁用的）。
// 给管理端价格编辑面板用；只想知道"现在多少钱"用 effective_* 即可，不需要
// 自己在这个数组里做多条命中排序（那套逻辑属于 resolveDishPrices，见
// _shared/dishPrice.ts，本接口已经算好了）
//
// 错误码：400（缺少 restaurant_id/dish_id）/ 404（菜品不存在，或公开访问时
// 状态不符合）/ 500（服务器错误）

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

// 特权访问（admin / 该餐厅或父餐厅有 user_restaurant_role）才有的字段：
// category_id、print_text、print_tag、custom_dish 的完整内容不受状态过滤限制
export const GetDishByIdResponseSchema = z.object({
  id: z.number().int(),
  sku: z.string(),
  status: z.string(),
  restaurant_id: z.number().int(),
  image: z.string().nullable(),
  custom_dish_id: z.number().int().nullable(),
  // 分时段生效价：dish_price 是唯一权威价格来源，dish 表已不存价格字段
  effective_price: z.number(),
  effective_discount: z.number().nullable(),
  effective_delivery_price: z.number(),
  effective_delivery_discount: z.number().nullable(),
  category_id: z.number().int().nullable().optional(),
  rates: z.number().int(),
  likes: z.number().int(),
  order_limit: z.number().int().nullable(),
  table_limit: z.number().int().nullable(),
  print_text: z.string().nullable().optional(), // 仅特权访问返回
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

  print_tag: z.array(DishTagEntrySchema), // 匿名访问恒为空数组
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
