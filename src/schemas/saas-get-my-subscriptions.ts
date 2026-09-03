// get-my-subscriptions — 查询当前用户自己的 SaaS 订阅列表
//
// Method: POST /functions/v1/saas-get-my-subscriptions
// 调用方: 客户端（xiaoxiong-web 用户查看自己名下的订阅）
// 认证: 需要登录，只能查自己的订阅（`userId` 必须等于调用者 JWT 的 `sub`，
//       否则 403）
//
// 非显而易见的行为：
// 1. 结果按 `created_at desc` 排序（最新的订阅排最前）。
// 2. 不传 `restaurantExternalId` 时返回该用户名下所有餐厅的订阅；传了则只返回
//    该餐厅的订阅。
// 3. `stripe_subscription_id` 以 `local_free_` 开头代表免费订阅（未接 Stripe），
//    以 `demo_` 开头代表 demo 账号订阅，两者都不对应真实 Stripe 订阅，前端据此
//    前缀判断是否展示"管理账单"等需要真实 Stripe 客户的入口。
//
// 成功响应（200）：`{ subscriptions: Subscription[] }`
// 错误码：400（校验失败）/ 401（未登录）/ 403（`userId` 与调用者不符）/ 500

import { z } from "zod";

export const GetMySubscriptionsInputSchema = z.object({
  userId: z.string().uuid(),
  environment: z.enum(["dev", "live"]),
  restaurantId: z.string().optional(),
  restaurantExternalId: z.number().int().positive().optional(),
});

export type GetMySubscriptionsInput = z.infer<typeof GetMySubscriptionsInputSchema>;
