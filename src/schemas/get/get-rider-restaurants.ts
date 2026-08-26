import { z } from "zod";

export const RiderRestaurantRowSchema = z.object({
  restaurant_id: z.number().int(),
  restaurant_name: z.string().nullable(),
  status: z.enum(["pending", "active", "suspended", "removed"]),
  base_fee: z.number().nullable(),
  joined_at: z.string(),
});

export const GetRiderRestaurantsResponseSchema = z.object({
  items: z.array(RiderRestaurantRowSchema),
});

export type GetRiderRestaurantsResponse = z.infer<typeof GetRiderRestaurantsResponseSchema>;
