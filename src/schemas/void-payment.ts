import { z } from "zod";

export const VoidPaymentInputSchema = z.object({
  payment_id: z.number().int().positive(),
  restaurant_id: z.number().int().positive(),
  reason: z.string().optional(), // 撤销原因，会传给 Vendus 撤票接口
});

export type VoidPaymentInput = z.infer<typeof VoidPaymentInputSchema>;

export const VoidPaymentResponseSchema = z.object({
  success: z.literal(true),
  table_id: z.number().int(),
  table_start_time: z.number().int(),
});

export type VoidPaymentResponse = z.infer<typeof VoidPaymentResponseSchema>;
