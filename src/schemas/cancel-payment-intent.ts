import { z } from "zod";

export const CancelPaymentIntentInputSchema = z.object({
  intent_id: z.number().int().positive(),
  restaurant_id: z.number().int().positive(),
  cancelled_by: z.string().optional(),
});

export type CancelPaymentIntentInput = z.infer<typeof CancelPaymentIntentInputSchema>;

export const CancelPaymentIntentResponseSchema = z.object({
  ok: z.literal(true),
  intent_id: z.number().int(),
  intent_status: z.literal("cancelled"),
});

export type CancelPaymentIntentResponse = z.infer<typeof CancelPaymentIntentResponseSchema>;
