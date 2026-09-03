// get-all-subscriptions — 管理员查询全部 SaaS 订阅（跨用户、跨餐厅、跨 environment）
//
// Method: POST /functions/v1/saas-get-all-subscriptions
// 调用方: 管理端（平台管理员后台）
// 认证: 需要登录 + 调用者是平台管理员（public.user_role 关联 role.name='admin'），否则 403
//
// 非显而易见的行为：
// 1. 无需请求体（可传 `{}` 或空 body）。
// 2. 每行附带 `user_email`/`user_name`（从 `user_information` 联查得到，不是
//    `subscriptions` 表自身字段）。
// 3. 结果按 `created_at desc` 排序，不分页，不区分 environment（dev/live 一并
//    返回，前端按 `environment` 字段自行过滤展示）。
//
// 成功响应（200）：`{ subscriptions: (Subscription & { user_email, user_name })[] }`
// 错误码：401（未登录）/ 403（非管理员）/ 500

export {};
