import { z } from "zod";

// 必须提供 vendus_key 或 restaurant_id 之一
export const GetVendusRegistersQuerySchema = z.object({
  vendus_key: z.string().optional(),
  restaurant_id: z.coerce.number().int().positive().optional(),
}).refine(
  (q) => !!q.vendus_key || q.restaurant_id != null,
  { message: "Provide either vendus_key or restaurant_id" },
);

export type GetVendusRegistersQuery = z.infer<typeof GetVendusRegistersQuerySchema>;

export const VendusRegisterSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  title: z.string(),
  active: z.boolean(),
  mode: z.string(),
});

export type VendusRegister = z.infer<typeof VendusRegisterSchema>;

export const GetVendusRegistersResponseSchema = z.array(VendusRegisterSchema);

export type GetVendusRegistersResponse = z.infer<typeof GetVendusRegistersResponseSchema>;
