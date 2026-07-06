import { z } from "zod";

export const GetTablePaymentIntentQuerySchema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  table_id: z.coerce.number().int().positive(),
  table_start_time: z.coerce.number().int().positive(),
});

export type GetTablePaymentIntentQuery = z.infer<typeof GetTablePaymentIntentQuerySchema>;

export const PaymentIntentSchema = z.object({
  intent_id: z.number().int(),
  status: z.enum(["pending", "paid", "failed", "expired", "cancelled", "superseded"]),
  method: z.enum(["multibanco", "mbway", "card", "payshop", "cofidis"]),
  amount: z.number(),
  created_at: z.string(),
  paid_at: z.string().nullable(),
  // multibanco / payshop
  entity: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  expiry_date: z.string().nullable().optional(),
  // mbway
  request_id: z.string().nullable().optional(),
  mobile_number: z.string().nullable().optional(),
  // card / cofidis
  payment_url: z.string().nullable().optional(),
});

export type PaymentIntent = z.infer<typeof PaymentIntentSchema>;

export const GetTablePaymentIntentResponseSchema = z.object({
  intent: PaymentIntentSchema.nullable(),
  can_continue: z.boolean().optional(), // intent 为 null 时不返回
});

export type GetTablePaymentIntentResponse = z.infer<typeof GetTablePaymentIntentResponseSchema>;
