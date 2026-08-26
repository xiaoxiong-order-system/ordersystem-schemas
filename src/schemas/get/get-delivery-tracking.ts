import { z } from "zod";

export const GetDeliveryTrackingQuerySchema = z.object({
  delivery_order_id: z.coerce.number().int().positive(),
});

export type GetDeliveryTrackingQuery = z.infer<typeof GetDeliveryTrackingQuerySchema>;

export const GetDeliveryTrackingResponseSchema = z.object({
  rider_id: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  updated_at: z.string().nullable(),
});

export type GetDeliveryTrackingResponse = z.infer<typeof GetDeliveryTrackingResponseSchema>;
