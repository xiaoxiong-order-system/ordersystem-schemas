import { z } from "zod";

export const TableInvoiceVoidInputSchema = z.object({
  payment_id: z.number().int().positive(),
  restaurant_id: z.number().int().positive(),
  reason: z.string().trim().min(1),
});
export type TableInvoiceVoidInput = z.infer<typeof TableInvoiceVoidInputSchema>;

export const TableInvoiceVoidResponseSchema = z.object({
  success: z.literal(true),
  payment_id: z.number().int(),
  invoice_status: z.literal("voided"),
});
export type TableInvoiceVoidResponse = z.infer<typeof TableInvoiceVoidResponseSchema>;
