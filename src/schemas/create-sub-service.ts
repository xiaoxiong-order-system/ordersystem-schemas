import { z } from "zod";

// 只支持四种客户可见服务（有独立展示页面的），不含 pos（商家 POS 端下单，没有子餐厅展示页面的概念）
export const SubServiceTypeSchema = z.enum(["order", "takeaway", "delivery", "reserver"]);
export type SubServiceType = z.infer<typeof SubServiceTypeSchema>;

export const CreateSubServiceInputSchema = z.object({
  restaurant_id: z.number().int().positive(), // 子餐厅自己的 restaurant_id，不是父餐厅的
  service_type: SubServiceTypeSchema,
  // 权限码后缀（不含 service.${service_type}. 前缀），如 "basic"、"payment.online"；
  // 函数内部会拼成完整权限码去 restaurant_permission 表校验是否存在
  permissions: z.array(z.string()).min(1),
});
export type CreateSubServiceInput = z.infer<typeof CreateSubServiceInputSchema>;

export const CreateSubServiceResponseSchema = z.object({ ok: z.literal(true) });
export type CreateSubServiceResponse = z.infer<typeof CreateSubServiceResponseSchema>;
