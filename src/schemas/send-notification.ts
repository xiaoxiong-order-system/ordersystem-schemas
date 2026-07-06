import { z } from "zod";

// notification_type 不做硬编码枚举：合法值由 notification_type 字典表决定，
// 函数会再查一次 DB 校验，这里只保证是非空字符串，避免 schema 和字典表脱节
export const SendNotificationInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  table_id: z.number().int().positive(),
  table_start_time: z.number().int().nullable().optional(), // 不传则从桌台记录自动读取
  notification_type: z.string().min(1),
  message: z.string().nullable().optional(), // notification_type=payment 时须为 9 位数字（函数内校验）
  description: z.string().nullable().optional(),
  sent_at: z.string().nullable().optional(), // ISO 8601，不传则用 DB 默认 NOW()
});

export type SendNotificationInput = z.infer<typeof SendNotificationInputSchema>;

export const SendNotificationResponseSchema = z.object({
  id: z.number().int(),
  notification_type: z.string(),
  message: z.string().nullable(),
  description: z.string().nullable(),
  sent_by: z.string().uuid().nullable(),
  created_at: z.string(),
});

export type SendNotificationResponse = z.infer<typeof SendNotificationResponseSchema>;
