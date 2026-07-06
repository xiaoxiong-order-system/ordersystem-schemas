import { z } from "zod";

// get-dinein/takeaway/delivery/reserver-service 共用的子结构

export const ServiceQuerySchema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  language: z.string().optional(), // 逗号分隔，默认 zh；仅 dinein/takeaway 的 info_cards 会用到
});

export type ServiceQuery = z.infer<typeof ServiceQuerySchema>;

export const OpenHourRowSchema = z.object({
  weekday: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  discount: z.number(),
});

export const SpacialDayRowSchema = z.object({
  id: z.number().int(),
  text: z.string(),
  year: z.number().int().nullable(),
  month: z.number().int().nullable(),
  day: z.number().int().nullable(),
  week_day: z.string().nullable(),
  start_time: z.string(),
  end_time: z.string(),
  enable: z.boolean(),
});

export const BusinessHourSchema = z.object({
  time_interval: z.number().int().nullable(),
  exclude_date: z.array(z.string()).nullable(),
  exclude_week_day: z.array(z.string()).nullable(),
  exclude_monthly_day: z.array(z.number().int()).nullable(),
});

export const BackgroundRowSchema = z.object({
  id: z.number().int(),
  screen_type: z.string(),
  image_path: z.string(),
  weight: z.number().int(),
});

export const PaymentTypeControlRowSchema = z.object({
  payment_type_code: z.string(),
  enable: z.boolean(),
  data: z.unknown().nullable(),
});

export const MultilinguaTextRowSchema = z.object({ language_code: z.string(), text: z.string().nullable() });
