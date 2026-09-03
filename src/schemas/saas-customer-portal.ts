// customer-portal — 生成 Stripe Billing Portal 链接，供用户自助管理账单/发票
//
// Method: POST /functions/v1/saas-customer-portal
// 调用方: 客户端（xiaoxiong-web「我的订阅」页面）
// 认证: 需要登录，`userId` 必须等于调用者 JWT 的 `sub`
//
// 非显而易见的行为：
// 1. 找该用户在指定 `environment` 下最近一条带 `stripe_customer_id` 的
//    `subscriptions` 行；免费订阅（`stripe_subscription_id` 为 `local_free_`/
//    `demo_` 前缀）没有真实 Stripe Customer，若用户只有这类订阅会返回 404。
//
// 成功响应（200）：`{ portalUrl: string }`
// 错误码：400（校验失败）/ 401（未登录）/ 403（`userId` 不符）/ 404（没有可用的
// Stripe 客户账号）/ 500（Stripe 调用异常）

import { z } from "zod";

export const CustomerPortalInputSchema = z.object({
  userId: z.string().uuid(),
  environment: z.enum(["dev", "live"]),
  returnUrl: z.string().optional(),
});

export type CustomerPortalInput = z.infer<typeof CustomerPortalInputSchema>;
