import { z } from "zod";

export const CancelPaymentIntentInputSchema = z.object({
  intent_id: z.number().int().positive(),
  restaurant_id: z.number().int().positive(),
  cancelled_by: z.string().optional(),
  // 缺省 = 堂食（table_payment_intent），takeaway（自取）/ delivery（配送）操作 service_payment_intent，订单都在 delivery_order
  order_type: z.enum(["takeaway", "delivery"]).optional(),
});

export type CancelPaymentIntentInput = z.infer<typeof CancelPaymentIntentInputSchema>;

export const CancelPaymentIntentResponseSchema = z.object({
  ok: z.literal(true),
  intent_id: z.number().int(),
  intent_status: z.literal("cancelled"),
});

export type CancelPaymentIntentResponse = z.infer<typeof CancelPaymentIntentResponseSchema>;
