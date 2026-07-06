import { z } from "zod";

const baseIntentSchema = z.object({
  restaurant_id: z.number().int().positive(),
  table_id: z.number().int().positive(),
  table_start_time: z.number().int().positive(),
  // 通用可选
  description: z.string().optional(),
  language: z.string().optional(),
  nif: z.string().optional(),
  customer_name: z.string().optional(),
  created_by: z.string().optional(),
  tip_amount: z.number().optional(),
});

// method 决定各支付方式的必填字段：mbway 必须提供手机号，card 必须提供 success_url
export const CreateTablePaymentIntentInputSchema = z.discriminatedUnion("method", [
  baseIntentSchema.extend({
    method: z.literal("multibanco"),
    expiry_days: z.number().int().positive().optional(),
  }),
  baseIntentSchema.extend({
    method: z.literal("mbway"),
    mobile_number: z.string().min(1),
    email: z.string().email().optional(),
  }),
  baseIntentSchema.extend({
    method: z.literal("card"),
    success_url: z.string().min(1),
    error_url: z.string().optional(),
    cancel_url: z.string().optional(),
  }),
]);

export type CreateTablePaymentIntentInput = z.infer<typeof CreateTablePaymentIntentInputSchema>;

export const CreateTablePaymentIntentResponseSchema = z.object({
  intent_id: z.number().int(),
  method: z.enum(["multibanco", "mbway", "card"]),
  amount: z.number(),
  // Multibanco / Payshop
  entity: z.string().optional(),
  reference: z.string().optional(),
  expiry_date: z.string().optional(),
  // MB Way
  request_id: z.string().optional(),
  // Card / Cofidis
  payment_url: z.string().optional(),
});

export type CreateTablePaymentIntentResponse = z.infer<typeof CreateTablePaymentIntentResponseSchema>;
