import { z } from "zod";

export const IssueExternalPlatformInvoiceInputSchema = z.object({
  external_platform_order_id: z.number().int().positive(),
  nif:            z.string().trim().min(1).optional(),
  customer_name:  z.string().trim().min(1).optional(),
  address:        z.string().trim().min(1).optional(),
  // 自由字符串，与 issue-delivery-invoice 一致；不传则取订单 payment_type，再按 payment_status 推断
  payment_method: z.string().min(1).optional(),
  print_invoice:  z.boolean().optional(),
});
export type IssueExternalPlatformInvoiceInput = z.infer<typeof IssueExternalPlatformInvoiceInputSchema>;

export const IssueExternalPlatformInvoiceResponseSchema = z.object({
  external_platform_order_id: z.number().int(),
  invoice_status: z.enum(["success", "failed", "none"]),
  invoice_ref:    z.string().nullable(),
  invoice_error:  z.string().nullable(),
  reprinted:      z.boolean(),
  print_result:   z.object({
    success: z.boolean(),
    message: z.string(),
  }).nullable(),
});
export type IssueExternalPlatformInvoiceResponse = z.infer<typeof IssueExternalPlatformInvoiceResponseSchema>;
