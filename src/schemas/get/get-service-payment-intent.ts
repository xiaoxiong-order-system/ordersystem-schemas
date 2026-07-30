import { z } from "zod";

export const GetServicePaymentIntentQuerySchema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  order_type: z.enum(["takeaway", "delivery"]),
  order_id: z.coerce.number().int().positive(),
});

export type GetServicePaymentIntentQuery = z.infer<typeof GetServicePaymentIntentQuerySchema>;

export const ServicePaymentIntentSchema = z.object({
  intent_id: z.number().int(),
  status: z.enum(["pending", "paid", "failed", "expired", "cancelled", "superseded"]),
  method: z.enum(["mbway", "card"]),
  amount: z.number(),
  created_at: z.string(),
  paid_at: z.string().nullable(),
  // mbway
  request_id: z.string().nullable().optional(),
  mobile_number: z.string().nullable().optional(),
  // card
  payment_url: z.string().nullable().optional(),
});

export type ServicePaymentIntent = z.infer<typeof ServicePaymentIntentSchema>;

export const GetServicePaymentIntentResponseSchema = z.object({
  intent: ServicePaymentIntentSchema.nullable(),
  can_continue: z.boolean().optional(), // intent 为 null 时不返回
});

export type GetServicePaymentIntentResponse = z.infer<typeof GetServicePaymentIntentResponseSchema>;
