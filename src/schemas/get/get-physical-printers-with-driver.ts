import { z } from "zod";

export const GetPhysicalPrintersWithDriverQuerySchema = z.object({
  id: z.coerce.number().int().positive(), // printer_driver.id
});

export type GetPhysicalPrintersWithDriverQuery = z.infer<typeof GetPhysicalPrintersWithDriverQuerySchema>;

export const GetPhysicalPrintersWithDriverResponseSchema = z.object({
  driver_id: z.string(),
  printers: z.array(z.string()),
});

export type GetPhysicalPrintersWithDriverResponse = z.infer<typeof GetPhysicalPrintersWithDriverResponseSchema>;
