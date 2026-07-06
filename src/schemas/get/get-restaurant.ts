import { z } from "zod";

export const GetRestaurantQuerySchema = z.object({
  code: z.string().min(1),
  include: z.string().optional(), // 逗号分隔；目前只有 "services"（含旧关键字 "restaurants" 向后兼容）
});

export type GetRestaurantQuery = z.infer<typeof GetRestaurantQuerySchema>;

export const RestaurantServiceEntrySchema = z.object({
  enabled: z.boolean(), // 是否已开通该服务的权限码
  can_order: z.boolean(), // 权限 + 父/自身 control.enable（或子餐厅 override）
  can_pay_online: z.boolean(),
  show: z.boolean(), // 首页是否展示
  tags: z.array(z.string()),
});

export const RestaurantServicesSchema = z.object({
  dinein: RestaurantServiceEntrySchema,
  takeaway: RestaurantServiceEntrySchema,
  delivery: RestaurantServiceEntrySchema,
  reserver: RestaurantServiceEntrySchema,
});

export const RestaurantEntrySchema = z.object({
  id: z.number().int(),
  code: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  self: z.boolean(), // 是否为请求 code 对应的那家（父或子）
  parent_id: z.number().int().nullable(),
  services: RestaurantServicesSchema.optional(), // include 不含 services 时省略
});

export type RestaurantEntry = z.infer<typeof RestaurantEntrySchema>;

export const GetRestaurantResponseSchema = z.object({
  restaurants: z.array(RestaurantEntrySchema), // 父餐厅 + 子餐厅（enable=true 的）
});

export type GetRestaurantResponse = z.infer<typeof GetRestaurantResponseSchema>;
