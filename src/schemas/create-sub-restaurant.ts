import { z } from "zod";

// create-sub-restaurant — 给已存在的父餐厅创建一个子餐厅
//
// Method: POST /functions/v1/create-sub-restaurant
// 调用方: 管理端（商家后台）
// 认证: 需要登录（Bearer token）。双层鉴权：平台身份必须是 merchant/admin
//       （否则 403）；merchant 身份还需对 parent_restaurant_id 拥有
//       sub_restaurant.create 权限（系统模板角色里目前只有 boss 默认拥有，
//       manager/staff 都没有；admin 直通，不受此限制）
//
// 非显而易见的行为：
// 1. 不绑定 boss 账号——has_restaurant_role_permission 本身支持"子餐厅自己
//    有角色，或其父餐厅有角色"，父餐厅的 boss/manager 创建完子餐厅立刻就能
//    管理它，不需要额外绑定
// 2. 不写任何 service_* 表——服务自动继承父餐厅：下单/结账相关函数判断服务
//    是否开通时都会解析 tableRestaurantId = parent_id ?? restaurant_id，
//    直接查父餐厅的服务记录。要给子餐厅配置独立展示数据（营业时间/背景图等）
//    用另一个函数 create-sub-service
// 3. 不支持多级嵌套：parent_restaurant_id 如果自己也是别人的子餐厅，422 拒绝
// 4. code 默认是 `${父餐厅code}-${code_suffix}`（不传 code_suffix 则用
//    slugify(name)）；也可以传 code 字段跳过这个拼接，直接给一个完全独立、
//    不含父餐厅前缀的编号——code 和 code_suffix 二选一，两个都传 400
//
// 除 parent_restaurant_id/name 外全部选填——restaurant_information/
// restaurant_business_information 两张表除 restaurant_id 外所有列都可为空。
//
// 成功响应（201）：{ id: number, code: string }
// 错误码：400（格式不合法/code与code_suffix同传）/ 401 / 403 / 404（父餐厅
// 不存在）/ 409（code 已存在）/ 422（多级嵌套）/ 500

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
