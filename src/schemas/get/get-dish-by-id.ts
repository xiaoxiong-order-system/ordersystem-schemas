import { z } from "zod";

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
