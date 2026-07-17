import { z } from "zod";

export const ServiceTypeSchema = z.enum(["order", "takeaway", "delivery", "reserver", "pos"]);
export type ServiceType = z.infer<typeof ServiceTypeSchema>;

export const CreateServiceInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  service_type: ServiceTypeSchema,
  // 权限码后缀（不含 service.${service_type}. 前缀），如 "basic"、"payment.online"；
  // 函数内部会拼成完整权限码去 restaurant_permission 表校验是否存在
  permissions: z.array(z.string()).min(1),
});
export type CreateServiceInput = z.infer<typeof CreateServiceInputSchema>;

export const CreateServiceResponseSchema = z.object({ ok: z.literal(true) });
export type CreateServiceResponse = z.infer<typeof CreateServiceResponseSchema>;
