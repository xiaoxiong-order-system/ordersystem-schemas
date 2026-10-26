import { z } from "zod";

// SushiCome 创建桌台预约：字段与 create-reserver 相同，email 改为选填（不传就不给顾客发确认邮件）
export const SushicomeCreateReserverInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  contact_name: z.string().min(1),
  contact_phone: z.string().min(1),
  email: z.string().email().nullish(),
  guest_count: z.number().int().min(1),
  reserved_at: z.string().min(1), // ISO 8601
  note: z.string().nullish(),
});

export type SushicomeCreateReserverInput = z.infer<typeof SushicomeCreateReserverInputSchema>;

export const SushicomeCreateReserverResponseSchema = z.object({
  id: z.number().int(),
  record_no: z.number().int(),
});

export type SushicomeCreateReserverResponse = z.infer<typeof SushicomeCreateReserverResponseSchema>;
