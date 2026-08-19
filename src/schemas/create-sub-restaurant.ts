import { z } from "zod";

// 创建子餐厅：不绑定 boss 账号（靠父餐厅角色自动继承），不写任何 service_*
// 表（服务自动继承父餐厅，见 create-sub-restaurant/README.md）。
// 除 parent_restaurant_id/name 外全部选填——restaurant_information/
// restaurant_business_information 两张表除 restaurant_id 外所有列都可为空。

const LocationSchema = z.object({
  street:    z.string().optional(),
  city:      z.string().optional(),
  region:    z.string().optional(),
  country:   z.string().optional(),
  post_code: z.string().optional(),
});

export const CreateSubRestaurantInputSchema = z.object({
  parent_restaurant_id: z.number().int().positive(),
  name:                 z.string().trim().min(1),
  // 完全独立的 code（不跟父餐厅 code 拼接），跟 code_suffix 二选一，都不传
  // 则走 code_suffix 的默认拼接规则
  code:        z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).optional(),
  // 不传则用 slugify(name)；最终 code = ${父餐厅code}-${code_suffix}，
  // 格式跟 import-restaurant/create-restaurant-from-data 里子餐厅命名规则一致
  code_suffix: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).optional(),
  sub_name:    z.string().optional(),
  phone:       z.string().optional(),
  email:       z.string().optional(),
  nif:         z.string().optional(),
  location:    LocationSchema.optional(),
}).refine(data => !(data.code && data.code_suffix), {
  message: "code and code_suffix are mutually exclusive; pass at most one",
  path:    ["code_suffix"],
});
export type CreateSubRestaurantInput = z.infer<typeof CreateSubRestaurantInputSchema>;

export const CreateSubRestaurantResponseSchema = z.object({
  id:   z.number().int(),
  code: z.string(),
});
export type CreateSubRestaurantResponse = z.infer<typeof CreateSubRestaurantResponseSchema>;
