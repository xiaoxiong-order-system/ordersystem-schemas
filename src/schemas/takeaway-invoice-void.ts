import { z } from "zod";

export const TakeawayInvoiceVoidInputSchema = z.object({
  takeaway_order_id: z.number().int().positive(),
  restaurant_id:      z.number().int().positive(),
  reason:              z.string().trim().min(1),
});
export type TakeawayInvoiceVoidInput = z.infer<typeof TakeawayInvoiceVoidInputSchema>;

export const TakeawayInvoiceVoidResponseSchema = z.object({
  success:            z.literal(true),
  takeaway_order_id:  z.number().int(),
  invoice_status:     z.literal("voided"),
});
export type TakeawayInvoiceVoidResponse = z.infer<typeof TakeawayInvoiceVoidResponseSchema>;
