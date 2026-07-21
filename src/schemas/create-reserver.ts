import { z } from "zod";

export const CreateReserverInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  contact_name: z.string().min(1),
  contact_phone: z.string().min(1),
  email: z.string().email(),
  guest_count: z.number().int().min(1),
  reserved_at: z.string().min(1), // ISO 8601
  note: z.string().nullish(),
});

export type CreateReserverInput = z.infer<typeof CreateReserverInputSchema>;

export const CreateReserverResponseSchema = z.object({
  id: z.number().int(),
  record_no: z.number().int(),
});

export type CreateReserverResponse = z.infer<typeof CreateReserverResponseSchema>;
