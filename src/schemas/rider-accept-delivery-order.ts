import { z } from "zod";

export const RiderAcceptDeliveryOrderInputSchema = z.object({
  delivery_order_id: z.number().int().positive(),
});

export type RiderAcceptDeliveryOrderInput = z.infer<typeof RiderAcceptDeliveryOrderInputSchema>;

export const RiderAcceptDeliveryOrderResponseSchema = z.object({
  id: z.number().int(),
  status: z.string(),
  rider_fee: z.number().nullable(),
  assigned_at: z.string(),
});

export type RiderAcceptDeliveryOrderResponse = z.infer<typeof RiderAcceptDeliveryOrderResponseSchema>;
