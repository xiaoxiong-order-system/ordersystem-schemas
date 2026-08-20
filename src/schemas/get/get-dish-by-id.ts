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
//   的关联和标签本身
// - 特权访问不受状态过滤（能查 draft/closed 等任意状态），返回上述全部字段，
//   且 enable=false 的标签关联也会返回（管理端要能看到/恢复已禁用的配置）
//
// 分时段生效价（effective_price 等 4 个字段）：按 dish_price 表 + 餐厅所在地
// 本地时间解析出的"此刻生效"的价格/折扣，命中就覆盖，没命中就分别等于
// price/discount/delivery_price/delivery_discount；原始 4 个字段永远是
// dish 表原值，不受影响。前端展示菜品详情价格时应该用 effective_* 系列，
// 不要直接用 price/delivery_price（那是原价，可能已经不是当前实际售价）
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

// 特权访问（admin / 该餐厅或父餐厅有 user_restaurant_role）才有的字段：
// category_id、print_text、print_tag、custom_dish 的完整内容不受状态过滤限制
export const GetDishByIdResponseSchema = z.object({
  id: z.number().int(),
  sku: z.string(),
  status: z.string(),
  restaurant_id: z.number().int(),
  image: z.string().nullable(),
  custom_dish_id: z.number().int().nullable(),
  price: z.number(),
  discount: z.number().nullable(),
  delivery_price: z.number(),
  delivery_discount: z.number().nullable(),
  // 分时段生效价（dish_price 命中时覆盖，没有匹配行时分别等于 price/discount/
  // delivery_price/delivery_discount）；上面四个原始字段保留不变，避免破坏
  // 现有消费方
  effective_price: z.number().optional(),
  effective_discount: z.number().nullable().optional(),
  effective_delivery_price: z.number().optional(),
  effective_delivery_discount: z.number().nullable().optional(),
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
