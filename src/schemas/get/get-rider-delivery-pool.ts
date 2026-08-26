import { z } from "zod";

export const RiderDeliveryPoolOrderSchema = z.object({
  id: z.number().int(),
  restaurant_id: z.number().int(),
  restaurant_name: z.string().nullable(),
  contact_name: z.string(),
  address: z.string(),
  total_price: z.number(),
  created_at: z.string(),
});

export const GetRiderDeliveryPoolResponseSchema = z.object({
  pool: z.array(RiderDeliveryPoolOrderSchema),
  active_order: RiderDeliveryPoolOrderSchema.extend({ status: z.string() }).nullable(),
});

export type GetRiderDeliveryPoolResponse = z.infer<typeof GetRiderDeliveryPoolResponseSchema>;
