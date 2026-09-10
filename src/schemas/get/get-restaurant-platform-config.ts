import { z } from "zod";

export const GetRestaurantPlatformConfigQuerySchema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  platform: z.string().min(1),
});
export type GetRestaurantPlatformConfigQuery = z.infer<typeof GetRestaurantPlatformConfigQuerySchema>;

export const GetRestaurantPlatformConfigResponseSchema = z.union([
  z.object({ configured: z.literal(false) }),
  z.object({
    configured: z.literal(true),
    restaurant_id: z.number().int(),
    platform: z.string(),
    platform_location_key: z.string(),
    enabled: z.boolean(),
  }),
]);
export type GetRestaurantPlatformConfigResponse = z.infer<typeof GetRestaurantPlatformConfigResponseSchema>;
