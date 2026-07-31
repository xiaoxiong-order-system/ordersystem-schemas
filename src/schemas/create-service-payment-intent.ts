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
  // 电子发票邮箱：与 mbway 分支下的 email（ifthenpay 自己的短信/邮件收据）无关，
  // 是 Vendus 发票的收件邮箱
  invoice_email: z.string().email().optional(),
  created_by: z.string().optional(),
});

// method 决定各支付方式的必填字段：mbway 必须提供手机号，card 必须提供 success_url
// nif / customer_name 各自完全可选，互不强制（只填名字不填 nif 时对开票没有实际
// 作用，但不在这里拦截，由前端 UI 自行决定如何引导用户）
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
