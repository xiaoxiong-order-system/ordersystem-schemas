import { z } from "zod";

// completed 只标记完成（不改支付方式 / 付款状态）；cancelled 必须带 cancel_reason
export const MerchantUpdateSushicomeOrderStatusInputSchema = z.discriminatedUnion("status", [
  z.object({
    external_platform_order_id: z.number().int().positive(),
    status: z.literal("completed"),
  }),
  z.object({
    external_platform_order_id: z.number().int().positive(),
    status:        z.literal("cancelled"),
    cancel_reason: z.string().trim().min(1),
  }),
]);
export type MerchantUpdateSushicomeOrderStatusInput = z.infer<typeof MerchantUpdateSushicomeOrderStatusInputSchema>;

export const MerchantUpdateSushicomeOrderStatusResponseSchema = z.object({
  ok: z.literal(true),
  id:             z.number().int(),
  status:         z.enum(["completed", "cancelled"]),
  payment_status: z.string(),
  payment_type:   z.string().nullable(),
  // 支付渠道：in_store 店内支付 / online 线上支付；NULL = 下单时未传
  payment_channel: z.enum(["in_store", "online"]).nullable(),
  completed_at:   z.string().nullable(),
  completed_by:   z.string().nullable(),
  cancel_reason:  z.string().nullable(),
  cancelled_at:   z.string().nullable(),
  cancelled_by:   z.string().nullable(),
  // 本次取消时 SushiCome 返回的退款状态（not_required / succeeded 等）；完成 / 未同步时为 null，不落库
  refund_status:  z.string().nullable(),
  // 以下退款字段只在 SushiCome 确认原路退款成功时有值
  refunded_at:    z.string().nullable(),
  refund_amount:  z.number().nullable(),
  refunded_by:    z.string().nullable(),
  // 退款方式，如 mbway / card
  refund_method:  z.string().nullable(),
  // 脱敏退款账户，*** + 最后几位数字，如 ***789
  refund_account: z.string().nullable(),
});
export type MerchantUpdateSushicomeOrderStatusResponse = z.infer<typeof MerchantUpdateSushicomeOrderStatusResponseSchema>;

// 错误响应的 code（与 SushiCome Worker 同步相关的新增在后半部分）
export const MerchantUpdateSushicomeOrderStatusErrorCodes = [
  "ORDER_NOT_FOUND",
  "FORBIDDEN",
  "PLATFORM_NOT_SUPPORTED",
  "ORDER_CANCELLED",
  "INVOICE_ISSUED",
  "CONFLICT",
  // ↓ SushiCome Worker 同步
  "REFUND_PENDING",            // 202：退款处理中需核对，本地未取消
  "SUSHICOME_ORDER_NOT_FOUND", // 409：SushiCome 不认识这张单
  "REFUND_REJECTED",           // 409 / 502：退款被拒（如商户余额不足），处理后再次取消即发起新退款
  "SYNC_ID_CONFLICT",          // 500：操作号冲突（不应出现）
  "SYNC_ERROR",                // 502：签名 / 请求错误
  "SYNC_UNAVAILABLE",          // 503：SushiCome 不可用或超时，结果未确认，稍后重试
  "CONFLICT_AFTER_REFUND",     // 409：SushiCome 已取消（可能已退款）但本地并发冲突，需人工对账
  "CONFLICT_AFTER_SYNC",       // 409：SushiCome 已完成但本地并发冲突，需人工对账
  "LOCAL_UPDATE_FAILED_AFTER_SYNC", // 500：SushiCome 已生效但本地写入失败，需人工对账
  // 另外 409 时 code 可能直接是 SushiCome 的错误码，如 ORDER_STATUS_CONFLICT / ORDER_ALREADY_COMPLETED / REFUND_NOT_ELIGIBLE
] as const;
