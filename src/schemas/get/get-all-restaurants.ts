import { z } from "zod";

export const GetAllRestaurantsQuerySchema = z.object({
  include: z.string().optional(), // 目前只认 "services"，其余值被忽略
});

export type GetAllRestaurantsQuery = z.infer<typeof GetAllRestaurantsQuerySchema>;

export const RestaurantInformationSchema = z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  location_city: z.string().nullable(),
  location_country: z.string().nullable(),
  logo: z.string().nullable(),
});

export const AllRestaurantsServiceInfoSchema = z.object({
  has: z.boolean(), // 是否已开通（有 basic 或 payment.online 权限）
  enabled: z.boolean(), // service_*_control.enable
  payment_online: z.boolean(),
});

export const AllRestaurantsServiceFlagsSchema = z.object({
  order: AllRestaurantsServiceInfoSchema,
  takeaway: AllRestaurantsServiceInfoSchema,
  delivery: AllRestaurantsServiceInfoSchema,
  reserver: AllRestaurantsServiceInfoSchema,
});

// 子节点没有 sub_restaurants 字段；顶层节点必有（可能是空数组）
const restaurantNodeBase = z.object({
  id: z.number().int(),
  code: z.string(),
  description: z.string().nullable().optional(),
  restaurant_information: RestaurantInformationSchema.nullable(),
  parent_id: z.number().int().nullable(),
  restaurant_role_id: z.number().int().nullable().optional(), // 仅非 admin 调用者返回
  services: AllRestaurantsServiceFlagsSchema.nullable().optional(), // include=services 时才有
});

export const RestaurantTreeChildSchema = restaurantNodeBase;
export const RestaurantTreeNodeSchema = restaurantNodeBase.extend({
  sub_restaurants: z.array(RestaurantTreeChildSchema),
});

export type RestaurantTreeNode = z.infer<typeof RestaurantTreeNodeSchema>;

export const GetAllRestaurantsResponseSchema = z.array(RestaurantTreeNodeSchema);

export type GetAllRestaurantsResponse = z.infer<typeof GetAllRestaurantsResponseSchema>;
