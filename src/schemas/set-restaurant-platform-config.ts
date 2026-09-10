import { z } from "zod";

export const SetRestaurantPlatformConfigInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  platform: z.string().min(1),
  platform_location_key: z.string().min(1),
  enabled: z.boolean().optional(),
});
export type SetRestaurantPlatformConfigInput = z.infer<typeof SetRestaurantPlatformConfigInputSchema>;

export const SetRestaurantPlatformConfigResponseSchema = z.object({
  ok: z.literal(true),
  restaurant_id: z.number().int(),
  platform: z.string(),
  platform_location_key: z.string(),
  enabled: z.boolean(),
});
export type SetRestaurantPlatformConfigResponse = z.infer<typeof SetRestaurantPlatformConfigResponseSchema>;
