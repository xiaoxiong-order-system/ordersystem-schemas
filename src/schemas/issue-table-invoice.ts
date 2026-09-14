import { z } from "zod";
import { PrintConfigSchema, PeopleBreakdownItemSchema } from "./table-checkout.ts";

const EditablePaymentItemSchema = z.object({
  payment_type_code: z.string().min(1),
  amount: z.number(),
  tip_amount: z.number(),
});

export const IssueTableInvoiceInputSchema = z.object({
  payment_id: z.number().int().positive(),
  nif: z.string().optional(),
  customer_name: z.string().optional(),
  address: z.string().optional(),
  print_config: PrintConfigSchema.optional(),
  // 完整编辑（结账记录页"补开发票"走完整结账流程时使用）：仅当该记录尚未
  // 开票（invoice_status !== "success"）时允许，传了 payment_items 即视为
  // 一次编辑提交
  discount_type: z.string().optional(),
  discount_value: z.number().optional(),
  tip_amount: z.number().optional(),
  payment_items: z.array(EditablePaymentItemSchema).optional(),
  // 作废重开（Anular e Reemitir）：仅当该记录已开票成功时允许
  void_and_reissue: z.boolean().optional(),
});
export type IssueTableInvoiceInput = z.infer<typeof IssueTableInvoiceInputSchema>;

export const IssueTableInvoiceResponseSchema = z.object({
  payment_id: z.number().int(),
  invoice_status: z.enum(["success", "failed", "none"]),
  invoice_ref: z.string().nullable(),
  invoice_error: z.string().nullable(),
  print_result: z.object({ success: z.boolean(), message: z.string() }).nullable(),
  reprinted: z.boolean(),
  final_amount: z.number(),
  discount_amount: z.number(),
  tip_amount: z.number(),
  people_amount: z.number(),
  people_breakdown: z.array(PeopleBreakdownItemSchema),
  previous_invoice_ref: z.string().nullable().optional(),
});
export type IssueTableInvoiceResponse = z.infer<typeof IssueTableInvoiceResponseSchema>;
