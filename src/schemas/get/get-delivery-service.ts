import { z } from "zod";
import {
  ServiceQuerySchema,
  OpenHourRowSchema,
  SpacialDayRowSchema,
  BusinessHourSchema,
  PaymentTypeControlRowSchema,
} from "./service-common.ts";

// 配送/预约服务比堂食/外卖简单：没有 view_model_id、信息卡片、背景图
export const GetDeliveryServiceQuerySchema = ServiceQuerySchema.omit({ language: true });
export type GetDeliveryServiceQuery = z.infer<typeof GetDeliveryServiceQuerySchema>;

export const DeliveryControlSchema = z.object({
  enable: z.boolean(),
});

export const GetDeliveryServiceResponseSchema = z.object({
  control: DeliveryControlSchema.nullable(),
  open_hours: z.array(OpenHourRowSchema),
  spacial_days: z.array(SpacialDayRowSchema),
  business_hour: BusinessHourSchema.nullable(),
  payment_types: z.array(PaymentTypeControlRowSchema),
});

export type GetDeliveryServiceResponse = z.infer<typeof GetDeliveryServiceResponseSchema>;
