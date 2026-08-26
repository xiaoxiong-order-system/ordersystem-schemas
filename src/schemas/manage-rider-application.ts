import { z } from "zod";

export const ManageRiderApplicationInputSchema = z.object({
  rider_restaurant_id: z.number().int().positive(),
  action: z.enum(["approve", "reject", "suspend", "reactivate", "remove"]),
  base_fee: z.number().positive().optional(),
}).refine(
  (v) => v.action !== "approve" || v.base_fee !== undefined,
  { message: "base_fee is required when action is 'approve'", path: ["base_fee"] },
);

export type ManageRiderApplicationInput = z.infer<typeof ManageRiderApplicationInputSchema>;

export const ManageRiderApplicationResponseSchema = z.object({
  id: z.number().int(),
  status: z.enum(["pending", "active", "suspended", "removed"]),
});

export type ManageRiderApplicationResponse = z.infer<typeof ManageRiderApplicationResponseSchema>;
