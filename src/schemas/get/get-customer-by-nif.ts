import { z } from "zod";

export const GetCustomerByNifQuerySchema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  nif: z.string().trim().min(1),
});

export type GetCustomerByNifQuery = z.infer<typeof GetCustomerByNifQuerySchema>;

export const GetCustomerByNifResponseSchema = z.object({
  customer_name: z.string().nullable(),
  address: z.string().nullable(),
});

export type GetCustomerByNifResponse = z.infer<typeof GetCustomerByNifResponseSchema>;
