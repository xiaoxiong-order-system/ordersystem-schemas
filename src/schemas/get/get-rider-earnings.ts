import { z } from "zod";

export const GetRiderEarningsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type GetRiderEarningsQuery = z.infer<typeof GetRiderEarningsQuerySchema>;

export const RiderEarningRowSchema = z.object({
  id: z.number().int(),
  restaurant_id: z.number().int(),
  rider_fee: z.number().nullable(),
  delivered_at: z.string(),
});

export const GetRiderEarningsResponseSchema = z.object({
  items: z.array(RiderEarningRowSchema),
  total: z.number(),
});

export type GetRiderEarningsResponse = z.infer<typeof GetRiderEarningsResponseSchema>;
