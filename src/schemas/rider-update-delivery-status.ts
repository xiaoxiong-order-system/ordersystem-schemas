import { z } from "zod";

export const RiderUpdateDeliveryStatusInputSchema = z.object({
  delivery_order_id: z.number().int().positive(),
  action: z.enum(["picked_up", "delivered"]),
});

export type RiderUpdateDeliveryStatusInput = z.infer<typeof RiderUpdateDeliveryStatusInputSchema>;

export const RiderUpdateDeliveryStatusResponseSchema = z.object({
  id: z.number().int(),
  status: z.string(),
  picked_up_at: z.string().nullable(),
  delivered_at: z.string().nullable(),
});

export type RiderUpdateDeliveryStatusResponse = z.infer<typeof RiderUpdateDeliveryStatusResponseSchema>;
