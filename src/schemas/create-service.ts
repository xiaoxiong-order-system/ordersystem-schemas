import { z } from "zod";

// 五个可开通的服务，每个服务只有一个权限码 service.<type>.basic：
//   delivery       外卖 + 配送合并为一个开通开关（两套服务表都会初始化）
//   payment_online 线上支付全局开关，没有服务表；没开通则该餐厅所有服务都不能线上支付
export const ServiceTypeSchema = z.enum(["pos", "order", "delivery", "reserver", "payment_online"]);
export type ServiceType = z.infer<typeof ServiceTypeSchema>;

export const CreateServiceInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  service_type: ServiceTypeSchema,
  // 权限码后缀（不含 service.${service_type}. 前缀），目前每个服务只有 "basic"，不传默认 ["basic"]；
  // 函数内部会拼成完整权限码去 restaurant_permission 表校验是否存在
  permissions: z.array(z.string()).min(1).default(["basic"]),
});
export type CreateServiceInput = z.infer<typeof CreateServiceInputSchema>;

export const CreateServiceResponseSchema = z.object({ ok: z.literal(true) });
export type CreateServiceResponse = z.infer<typeof CreateServiceResponseSchema>;
