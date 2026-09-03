// create-checkout — 创建 Stripe Embedded Checkout Session，用于 SaaS 订阅付款
//
// Method: POST /functions/v1/saas-create-checkout
// 调用方: 客户端（xiaoxiong-web 结账弹窗，见 CheckoutContext.tsx）
// 认证: 需要登录，`userId` 必须等于调用者 JWT 的 `sub`
//
// 非显而易见的行为：
// 1. `restaurantExternalId` 必须是调用者本人拥有角色的餐厅（`user_restaurant_role`
//    有记录），否则 403。
// 2. `priceId`/`quantity`（单数形式）和 `items`（数组形式）二选一，函数内部统一
//    归一化为 items 数组；`items[].priceId` 必须能在 `saas_products` 表的
//    `monthly_price_id`/`yearly_price_id` 中找到，且该产品在对应 `environment`
//    下配置了 `stripe_*_price_id_{dev|live}`，否则 400。
// 3. **幂等**：`CheckoutContext.tsx` 的 `fetchClientSecret` 在缓存的 clientSecret
//    被消费后可能重复调用本接口。函数会先查最近 30 分钟内、同一
//    `(user_id, restaurant_id, environment)` 下 line_items 完全相同的 `pending`
//    `checkout_sessions` 行，若其 Stripe Session 仍 `open` 则直接复用其
//    `client_secret`，不会重复创建 Stripe 资源。
// 4. demo 账号（邮箱在 `DEMO_ACCOUNT_EMAILS` 环境变量白名单内）跳过 Stripe，直接
//    在 `subscriptions` 表插入 `active` 状态的记录（`stripe_subscription_id`
//    以 `demo_` 前缀），返回 `{demo:true, redirectUrl}`。
// 5. `cartItemKeys`/`referralCode` 目前只透传进 Stripe metadata，不做购物车/
//    推荐码折扣计算（这两块功能本次不在实现范围）。
//
// 成功响应（200）：
// - demo 分支：`{ demo: true, redirectUrl: string }`
// - 正常分支：`{ clientSecret: string, sessionId: string }`
// 错误码：400（参数缺失/校验失败/价格未配置）/ 401（未登录）/ 403（`userId` 不符或
// 未拥有该餐厅）/ 500（数据库或 Stripe 调用异常）

import { z } from "zod";

const CheckoutItemSchema = z.object({
  priceId: z.string().min(1),
  quantity: z.number().int().positive().optional(),
});

export const CreateCheckoutInputSchema = z.object({
  items: z.array(CheckoutItemSchema).optional(),
  priceId: z.string().min(1).optional(),
  quantity: z.number().int().positive().optional(),
  customerEmail: z.string().email().optional(),
  userId: z.string().uuid(),
  returnUrl: z.string().optional(),
  cartItemKeys: z.string().optional(),
  referralCode: z.string().optional(),
  restaurantId: z.string().optional(),
  restaurantExternalId: z.number().int().positive(),
  customerCountry: z.string().optional(),
  environment: z.enum(["dev", "live"]),
}).refine((v) => (v.items && v.items.length > 0) || !!v.priceId, {
  message: "Either items or priceId must be provided",
});

export type CreateCheckoutInput = z.infer<typeof CreateCheckoutInputSchema>;
