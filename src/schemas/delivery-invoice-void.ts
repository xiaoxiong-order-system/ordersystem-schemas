import { z } from "zod";

export const DeliveryInvoiceVoidInputSchema = z.object({
  delivery_order_id: z.number().int().positive(),
  restaurant_id:      z.number().int().positive(),
  reason:              z.string().trim().min(1),
});
export type DeliveryInvoiceVoidInput = z.infer<typeof DeliveryInvoiceVoidInputSchema>;

export const DeliveryInvoiceVoidResponseSchema = z.object({
  success:            z.literal(true),
  delivery_order_id:  z.number().int(),
  invoice_status:     z.literal("voided"),
});
export type DeliveryInvoiceVoidResponse = z.infer<typeof DeliveryInvoiceVoidResponseSchema>;
