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
  // 电子发票邮箱：与 mbway 分支下的 email（ifthenpay 自己的短信/邮件收据）无关，
  // 是 Vendus 发票的收件邮箱
  invoice_email: z.string().email().optional(),
  created_by: z.string().optional(),
  tip_amount: z.number().optional(),
});

// method 决定各支付方式的必填字段：mbway 必须提供手机号，card 必须提供 success_url
// nif / customer_name 各自完全可选，互不强制（只填名字不填 nif 时对开票没有实际
// 作用，但不在这里拦截，由前端 UI 自行决定如何引导用户）
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
