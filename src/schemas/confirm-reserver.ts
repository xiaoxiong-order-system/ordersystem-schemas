import { z } from "zod";

export const ConfirmReserverQuerySchema = z.object({
  token: z.string().trim().min(1),
});

export type ConfirmReserverQuery = z.infer<typeof ConfirmReserverQuerySchema>;

export const ConfirmReserverResponseSchema = z.object({
  id: z.number().int(),
  record_no: z.number().int(),
  restaurant_id: z.number().int(),
  contact_name: z.string(),
  contact_phone: z.string(),
  email: z.string(),
  guest_count: z.number().int(),
  reserved_at: z.string(),
  note: z.string().nullable(),
  email_confirmed_at: z.string().nullable(),
  restaurant_name: z.string().nullable(),
  already_confirmed: z.boolean(),
});

export type ConfirmReserverResponse = z.infer<typeof ConfirmReserverResponseSchema>;
