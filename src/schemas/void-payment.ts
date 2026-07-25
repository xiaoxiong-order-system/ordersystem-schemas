import { z } from "zod";

export const VoidPaymentInputSchema = z.object({
  payment_id: z.number().int().positive(),
  restaurant_id: z.number().int().positive(),
});

export type VoidPaymentInput = z.infer<typeof VoidPaymentInputSchema>;

export const VoidPaymentResponseSchema = z.object({
  success: z.literal(true),
  payment_id: z.number().int(),
  status: z.string(),
});

export type VoidPaymentResponse = z.infer<typeof VoidPaymentResponseSchema>;
