import { z } from "zod";

export const RiderCancelDeliveryOrderInputSchema = z.object({
  delivery_order_id: z.number().int().positive(),
  reason: z.string().min(1).max(200).optional(),
});

export type RiderCancelDeliveryOrderInput = z.infer<typeof RiderCancelDeliveryOrderInputSchema>;

export const RiderCancelDeliveryOrderResponseSchema = z.object({
  id: z.number().int(),
  status: z.string(),
});

export type RiderCancelDeliveryOrderResponse = z.infer<typeof RiderCancelDeliveryOrderResponseSchema>;
