import { z } from "zod";

export const IssueTakeawayInvoiceInputSchema = z.object({
  takeaway_order_id: z.number().int().positive(),
  nif:            z.string().trim().min(1).optional(),
  customer_name:  z.string().trim().min(1).optional(),
  // 不做固定枚举——外卖到店支付方式不受限于线上预付的 mbway/card，
  // 店员开票时可以手动指定任意支付方式代码，与 table-checkout.ts 的
  // payment_type_code 保持同样宽松的自由字符串处理
  payment_method: z.string().min(1).optional(),
});
export type IssueTakeawayInvoiceInput = z.infer<typeof IssueTakeawayInvoiceInputSchema>;

export const IssueTakeawayInvoiceResponseSchema = z.object({
  takeaway_order_id: z.number().int(),
  invoice_status: z.enum(["success", "failed", "none"]),
  invoice_ref:    z.string().nullable(),
  invoice_error:  z.string().nullable(),
  reprinted:      z.boolean(),
  print_result:   z.object({
    success: z.boolean(),
    message: z.string(),
  }).nullable(),
});
export type IssueTakeawayInvoiceResponse = z.infer<typeof IssueTakeawayInvoiceResponseSchema>;
