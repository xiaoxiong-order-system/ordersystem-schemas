import { z } from "zod";

// completed 只标记完成（不改支付方式 / 付款状态）；cancelled 必须带 cancel_reason
export const MerchantUpdateSushicomeOrderStatusInputSchema = z.discriminatedUnion("status", [
  z.object({
    external_platform_order_id: z.number().int().positive(),
    status: z.literal("completed"),
  }),
  z.object({
    external_platform_order_id: z.number().int().positive(),
    status:        z.literal("cancelled"),
    cancel_reason: z.string().trim().min(1),
  }),
]);
export type MerchantUpdateSushicomeOrderStatusInput = z.infer<typeof MerchantUpdateSushicomeOrderStatusInputSchema>;

export const MerchantUpdateSushicomeOrderStatusResponseSchema = z.object({
  ok: z.literal(true),
  id:             z.number().int(),
  status:         z.enum(["completed", "cancelled"]),
  payment_status: z.string(),
  payment_type:   z.string().nullable(),
  completed_at:   z.string().nullable(),
  completed_by:   z.string().nullable(),
  cancel_reason:  z.string().nullable(),
  cancelled_at:   z.string().nullable(),
  cancelled_by:   z.string().nullable(),
});
export type MerchantUpdateSushicomeOrderStatusResponse = z.infer<typeof MerchantUpdateSushicomeOrderStatusResponseSchema>;
