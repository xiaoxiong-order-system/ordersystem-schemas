// saas-stripe-webhook — 平台 Stripe 账号的统一 Webhook（点餐支付）
//
// Method: POST /functions/v1/saas-stripe-webhook
// 调用方: 其他（Stripe 服务器主动回调，不经过前端）
// 认证: 不走 Supabase JWT（`verify_jwt=false`），靠 Stripe 自己的请求签名
//       （`stripe-signature` header + STRIPE_WEBHOOK_SECRET）验证，签名校验失败返回 400
//
// 非显而易见的行为：
// 1. 只处理 checkout.session.completed / async_payment_succeeded /
//    async_payment_failed / expired：Session id 命中 service_payment_intent
//    就交给 _shared/servicePaymentWebhook.ts 结算外卖 / 自取 / 配送的 Stripe 支付。
// 2. 其他事件（含 2026-11-21 已停用的 SaaS 订阅事件）一律 200 no-op。
//    subscriptions / checkout_sessions / cart_items 表已删除。
//
// 成功响应（200）：`{ received: true }`（命中点餐支付时由结算逻辑决定）
// 错误码：400（缺少签名/签名验证失败）/ 405（非 POST）/ 500（结算内部错误，Stripe 会重试）

export {};
