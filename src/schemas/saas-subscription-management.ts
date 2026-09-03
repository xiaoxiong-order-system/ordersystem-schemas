// subscription-management — SaaS 订阅的冲突检测/订阅/升降级/取消/审批，一个函数
// 按 `?action=` 分发多个 action（约定同 `referral-applications`/`ifthenpay` 等
// 已有的多 action 函数）
//
// Method: POST /functions/v1/saas-subscription-management?action=<action>
// 调用方: 客户端（用户自己的订阅操作） / 管理端（审批类 action）
// 认证: 全部需要登录；`list-all-requests`/`approve-cancellation`/
//       `reject-cancellation` 额外要求调用者是平台管理员（public.user_role 关联 role.name='admin'）
//
// 非显而易见的行为（各 action 通用）：
// 1. 除 `list-all-requests`/`approve-cancellation`/`reject-cancellation` 外，
//    body 里的 `userId` 必须等于调用者 JWT 的 `sub`，否则 403。
// 2. 涉及餐厅的 action，`restaurantExternalId`/`restaurantId` 对应的餐厅必须是
//    调用者本人在 `user_restaurant_role` 里有角色的餐厅。
//
// ── check-conflict ──────────────────────────────────────────────────
// 校验目标 priceId 与该用户在该餐厅现有订阅是否冲突。
// 非显而易见：冲突判定基于 `saas_products.key`（产品 family）和从 price_id 解析
// 出的 period（monthly/yearly），是对原 Lovable 时代前端冲突规则的简化重建
// （bundle 与单品的精确互斥矩阵原始实现已丢失，这里按「同 family 不同价格视为
// 冲突、bundle 与任何现有有效订阅视为冲突」的保守规则重建，如与预期不符需要
// 产品侧重新明确规则再调整）。
// 成功响应：`{ ok, action: "proceed"|"switch-monthly-to-yearly"|"require-cancellation"|"already-subscribed"|"require-cancel-other-tier", reason?, existing? }`
//
// ── subscribe-free ──────────────────────────────────────────────────
// 激活免费套餐，不碰 Stripe。同 family+餐厅已有有效订阅时返回 `{alreadySubscribed:true}`。
// 成功响应：`{}` 或 `{alreadySubscribed:true}`
//
// ── switch-monthly-to-yearly ────────────────────────────────────────
// 把现有 Stripe 订阅从月付换成年付（`proration_behavior:'create_prorations'`，
// 立即按比例补差价）。
// 成功响应：`{}`
//
// ── schedule-tier-downgrade ─────────────────────────────────────────
// 设置 `cancel_at_period_end:true`，订阅在当前计费周期结束后停止（用于"降级到
// 免费版"场景，到期后不再续费，免费版由用户下次访问时通过 subscribe-free 激活）。
// 成功响应：`{}`
//
// ── switch-version（升级/同 family 内平级换价）────────────────────────
// `direction:"upgrade"` 立即换价并补差价（`proration_behavior:'always_invoice'`），
// 返回 `mode:"prorated-immediate"`；`direction:"downgrade"` 且目标是付费档时立即
// 换价但不补差价/不退款（`proration_behavior:'none'`，简化实现——严格意义上的
// "到期后才生效"需要 Stripe Subscription Schedules，本次未实现，返回
// `mode:"next-period"` 但实际立即生效，前端展示的"下个周期生效"文案与后端行为
// 存在这个已知差异，需要产品侧确认是否接受）；目标是免费档时等同
// `schedule-tier-downgrade`（`cancel_at_period_end:true`），返回 `mode:"scheduled-cancel"`。
//
// ── cancel-subscription ─────────────────────────────────────────────
// 免费/demo 订阅：立即本地取消，`mode:"immediate"`。
// 月付：`cancel_at_period_end:true`，不需要审批，`mode:"end-of-period"`。
// 年付：不碰 Stripe，按已用天数比例计算 `suggested_refund` 后插入
// `subscription_cancellation_requests`（pending），`mode:"request-created"`；
// 同一订阅已有 pending 申请时返回 409。
//
// ── list-my-requests / list-all-requests ────────────────────────────
// 查自己的 / 全部（管理员）取消申请，按 `created_at desc`。
//
// ── approve-cancellation（管理员）────────────────────────────────────
// 加载申请（须 pending）→ Stripe 立即取消订阅 → 找该订阅最近一张发票的 charge →
// 按管理员给定的 `refundAmount`（不一定等于 `suggested_refund`）发起 Stripe 退款
// → 申请标记 approved，订阅标记 canceled。Stripe 调用失败时不标记 approved，
// 原样返回错误方便管理员重试（重试前会先查 Stripe 订阅当前状态，已经是
// canceled 就跳过取消这一步，避免重复取消报错）。
//
// ── reject-cancellation（管理员）─────────────────────────────────────
// 标记 rejected，订阅不受影响。
//
// 错误码（通用）：400（校验失败）/ 401（未登录）/ 403（`userId` 不符/未拥有餐厅/
// 非管理员）/ 404（订阅或申请不存在）/ 409（重复的 pending 申请，或状态不允许该操作）/
// 500（数据库或 Stripe 调用异常）

import { z } from "zod";

export const CheckConflictInputSchema = z.object({
  userId: z.string().uuid(),
  targetPriceId: z.string().min(1),
  environment: z.enum(["dev", "live"]),
  restaurantId: z.string().optional(),
  restaurantExternalId: z.number().int().positive(),
});

export const SubscribeFreeInputSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().min(1),
  priceId: z.string().optional(),
  period: z.enum(["monthly", "yearly"]),
  environment: z.enum(["dev", "live"]),
  restaurantId: z.string().optional(),
  restaurantExternalId: z.number().int().positive(),
});

export const SwitchMonthlyToYearlyInputSchema = z.object({
  userId: z.string().uuid(),
  subscriptionId: z.string().uuid(),
  environment: z.enum(["dev", "live"]),
});

export const ScheduleTierDowngradeInputSchema = z.object({
  userId: z.string().uuid(),
  subscriptionId: z.string().uuid(),
  environment: z.enum(["dev", "live"]),
});

export const SwitchVersionInputSchema = z.object({
  userId: z.string().uuid(),
  subscriptionId: z.string().uuid(),
  targetPriceId: z.string().min(1),
  direction: z.enum(["upgrade", "downgrade"]),
  environment: z.enum(["dev", "live"]),
});

export const CancelSubscriptionInputSchema = z.object({
  userId: z.string().uuid(),
  userEmail: z.string().email(),
  userName: z.string().nullable().optional(),
  subscriptionId: z.string().uuid(),
  reason: z.string().nullable().optional(),
  environment: z.enum(["dev", "live"]),
});

export const ListMyRequestsInputSchema = z.object({
  userId: z.string().uuid(),
});

export const ListAllRequestsInputSchema = z.object({}).optional();

export const ApproveCancellationInputSchema = z.object({
  id: z.string().uuid(),
  adminNote: z.string().optional(),
  reviewedBy: z.string().min(1),
  refundAmount: z.number().nonnegative(),
});

export const RejectCancellationInputSchema = z.object({
  id: z.string().uuid(),
  adminNote: z.string().optional(),
  reviewedBy: z.string().min(1),
});
