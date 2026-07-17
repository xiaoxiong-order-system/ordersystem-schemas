import { z } from "zod";
import { ServiceTypeSchema } from "./create-service.ts";

export const CancelServiceInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  service_type: ServiceTypeSchema,
});
export type CancelServiceInput = z.infer<typeof CancelServiceInputSchema>;

// 子餐厅走 sub_restaurant_service_override（关闭继承），父餐厅走真正取消服务，
// 两种情况响应结构相同，均为 200 + { ok: true }
export const CancelServiceResponseSchema = z.object({ ok: z.literal(true) });
export type CancelServiceResponse = z.infer<typeof CancelServiceResponseSchema>;
