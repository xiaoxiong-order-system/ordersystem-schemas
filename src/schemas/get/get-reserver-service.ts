import { z } from "zod";
import {
  ServiceQuerySchema,
  OpenHourRowSchema,
  SpacialDayRowSchema,
  BusinessHourSchema,
  PaymentTypeControlRowSchema,
} from "./service-common.ts";

// 结构与 get-delivery-service 一致（同样没有 view_model_id/信息卡片/背景图）
export const GetReserverServiceQuerySchema = ServiceQuerySchema.omit({ language: true });
export type GetReserverServiceQuery = z.infer<typeof GetReserverServiceQuerySchema>;

export const ReserverControlSchema = z.object({
  enable: z.boolean(),
});

export const GetReserverServiceResponseSchema = z.object({
  control: ReserverControlSchema.nullable(),
  open_hours: z.array(OpenHourRowSchema),
  spacial_days: z.array(SpacialDayRowSchema),
  business_hour: BusinessHourSchema.nullable(),
  payment_types: z.array(PaymentTypeControlRowSchema),
});

export type GetReserverServiceResponse = z.infer<typeof GetReserverServiceResponseSchema>;
