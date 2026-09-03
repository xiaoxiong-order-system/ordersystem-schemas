// stripe-webhook — 接收 Stripe 的订阅生命周期事件，同步 subscriptions/checkout_sessions
//
// Method: POST /functions/v1/saas-stripe-webhook
// 调用方: 其他（Stripe 服务器主动回调，不经过前端）
// 认证: 不走 Supabase JWT（`verify_jwt=false`），靠 Stripe 自己的请求签名
//       （`stripe-signature` header）验证，签名校验失败返回 400
//
// 非显而易见的行为：
// 1. dev/live 两个 Stripe 账号共用同一个 endpoint URL（同一份代码部署一次），
//    函数依次尝试用 `STRIPE_WEBHOOK_SECRET_DEV`/`STRIPE_WEBHOOK_SECRET_LIVE`
//    验签，哪个验证通过就按哪个 environment 处理该事件——这是判断事件属于
//    哪个 Stripe 账号的唯一方式（Stripe 签名密钥本身是按 endpoint 而非账号
//    区分的，两个账号各自的 webhook 配置都要指向这同一个 URL）。
// 2. 所有数据库写入都是 upsert/update 语义（按 `stripe_subscription_id` 或
//    `(stripe_subscription_id, price_id)` 匹配），天然幂等，不需要额外的
//    事件去重表——Stripe 重试同一个事件不会产生重复数据。
// 3. `checkout.session.completed` 事件依赖 `create-checkout` 提前写入的
//    `checkout_sessions` 行（按 `stripe_checkout_session_id` 关联）；如果找
//    不到对应行（理论上不应发生），记录一条错误日志后仍返回 200（避免 Stripe
//    无限重试一个永远处理不了的事件）。
// 4. 退款相关事件（`charge.refunded` 等）不处理——本项目的退款只由
//    `subscription-management?action=approve-cancellation` 主动发起并直接
//    写库，不依赖 webhook 回听。
//
// 成功响应（200）：`{ received: true }`
// 错误码：400（签名验证失败/无法解析 body）/ 405（非 POST）

export {};
