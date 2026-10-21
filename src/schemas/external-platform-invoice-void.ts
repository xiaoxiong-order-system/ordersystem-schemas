import { z } from "zod";

export const ExternalPlatformInvoiceVoidInputSchema = z.object({
  external_platform_order_id: z.number().int().positive(),
  restaurant_id:               z.number().int().positive(),
  reason:                      z.string().trim().min(1),
});
export type ExternalPlatformInvoiceVoidInput = z.infer<typeof ExternalPlatformInvoiceVoidInputSchema>;

export const ExternalPlatformInvoiceVoidResponseSchema = z.object({
  success:                    z.literal(true),
  external_platform_order_id: z.number().int(),
  invoice_status:             z.literal("voided"),
});
export type ExternalPlatformInvoiceVoidResponse = z.infer<typeof ExternalPlatformInvoiceVoidResponseSchema>;
