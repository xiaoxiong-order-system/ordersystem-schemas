import { z } from "zod";

const baseIntentSchema = z.object({
  restaurant_id: z.number().int().positive(),
  order_type: z.enum(["takeaway", "delivery"]),
  order_id: z.number().int().positive(),
  // 通用可选
  description: z.string().optional(),
  language: z.string().optional(),
  nif: z.string().optional(),
  customer_name: z.string().optional(),
  created_by: z.string().optional(),
});

// method 决定各支付方式的必填字段：mbway 必须提供手机号，card 必须提供 success_url
export const CreateServicePaymentIntentInputSchema = z.discriminatedUnion("method", [
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

export type CreateServicePaymentIntentInput = z.infer<typeof CreateServicePaymentIntentInputSchema>;

export const CreateServicePaymentIntentResponseSchema = z.object({
  intent_id: z.number().int(),
  method: z.enum(["mbway", "card"]),
  amount: z.number(),
  // MB Way
  request_id: z.string().optional(),
  // Card
  payment_url: z.string().optional(),
});

export type CreateServicePaymentIntentResponse = z.infer<typeof CreateServicePaymentIntentResponseSchema>;
