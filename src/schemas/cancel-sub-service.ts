import { z } from "zod";
import { SubServiceTypeSchema } from "./create-sub-service.ts";

export const CancelSubServiceInputSchema = z.object({
  restaurant_id: z.number().int().positive(), // 子餐厅自己的 restaurant_id
  service_type: SubServiceTypeSchema,
});
export type CancelSubServiceInput = z.infer<typeof CancelSubServiceInputSchema>;

export const CancelSubServiceResponseSchema = z.object({ ok: z.literal(true) });
export type CancelSubServiceResponse = z.infer<typeof CancelSubServiceResponseSchema>;
