import { z } from "zod";

// 只支持客户可见服务（有独立展示页面的），不含 pos（商家 POS 端下单，没有子餐厅展示页面的概念）
// 和 payment_online（全局开关，没有服务表）；delivery 同时涵盖外卖 + 配送
export const SubServiceTypeSchema = z.enum(["order", "delivery", "reserver"]);
export type SubServiceType = z.infer<typeof SubServiceTypeSchema>;

export const CreateSubServiceInputSchema = z.object({
  restaurant_id: z.number().int().positive(), // 子餐厅自己的 restaurant_id，不是父餐厅的
  service_type: SubServiceTypeSchema,
  // 权限码后缀（不含 service.${service_type}. 前缀），目前每个服务只有 "basic"，不传默认 ["basic"]；
  // 函数内部会拼成完整权限码去 restaurant_permission 表校验是否存在
  permissions: z.array(z.string()).min(1).default(["basic"]),
});
export type CreateSubServiceInput = z.infer<typeof CreateSubServiceInputSchema>;

export const CreateSubServiceResponseSchema = z.object({ ok: z.literal(true) });
export type CreateSubServiceResponse = z.infer<typeof CreateSubServiceResponseSchema>;
