import { z } from "zod";

export const IssueExternalPlatformInvoiceInputSchema = z.object({
  external_platform_order_id: z.number().int().positive(),
  nif:            z.string().trim().min(1).optional(),
  customer_name:  z.string().trim().min(1).optional(),
  address:        z.string().trim().min(1).optional(),
  // 自由字符串，与 issue-delivery-invoice 一致；不传则取订单 payment_type，再按 payment_status 推断
  payment_method: z.string().min(1).optional(),
  print_invoice:  z.boolean().optional(),
  // 订单 total_price 与明细合计对不上时，后端默认不开票并返回 total_mismatch；用户确认后带 true 重新提交
  confirm_total_mismatch: z.boolean().optional(),
});
export type IssueExternalPlatformInvoiceInput = z.infer<typeof IssueExternalPlatformInvoiceInputSchema>;

export const IssueExternalPlatformInvoiceResponseSchema = z.object({
  external_platform_order_id: z.number().int(),
  invoice_status: z.enum(["success", "failed", "none"]),
  invoice_ref:    z.string().nullable(),
  invoice_error:  z.string().nullable(),
  reprinted:      z.boolean(),
  // 仅在 total_price 与明细合计不一致且未确认时返回（此时 invoice_status 为 none、未调用 Vendus）
  total_mismatch: z.object({
    total_price: z.number(),
    items_total: z.number(),
  }).optional(),
  print_result:   z.object({
    success: z.boolean(),
    message: z.string(),
  }).nullable(),
});
export type IssueExternalPlatformInvoiceResponse = z.infer<typeof IssueExternalPlatformInvoiceResponseSchema>;
