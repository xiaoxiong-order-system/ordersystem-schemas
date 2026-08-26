import { z } from "zod";

export const RiderUpdateLocationInputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  online_status: z.enum(["online", "offline"]).optional(),
});

export type RiderUpdateLocationInput = z.infer<typeof RiderUpdateLocationInputSchema>;

export const RiderUpdateLocationResponseSchema = z.object({
  updated_at: z.string(),
  online_status: z.string(),
});

export type RiderUpdateLocationResponse = z.infer<typeof RiderUpdateLocationResponseSchema>;
