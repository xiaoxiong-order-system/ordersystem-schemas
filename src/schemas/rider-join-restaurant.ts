import { z } from "zod";

export const RiderJoinRestaurantInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
});

export type RiderJoinRestaurantInput = z.infer<typeof RiderJoinRestaurantInputSchema>;

export const RiderJoinRestaurantResponseSchema = z.object({
  id: z.number().int(),
  restaurant_id: z.number().int(),
  status: z.literal("pending"),
  joined_at: z.string(),
});

export type RiderJoinRestaurantResponse = z.infer<typeof RiderJoinRestaurantResponseSchema>;
