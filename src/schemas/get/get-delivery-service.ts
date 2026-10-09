import { z } from "zod";
import {
  ServiceQuerySchema,
  OpenHourRowSchema,
  SpacialDayRowSchema,
  BusinessHourSchema,
  BackgroundRowSchema,
  PaymentTypeControlRowSchema,
  MultilinguaTextRowSchema,
} from "./service-common.ts";

// 外卖配送服务（delivery）= 到店自取（takeaway）+ 配送（delivery），2026-10-09 起合并为一个服务：
// 开关、营业时间按 order_type 分开，其余配置（展示、信息卡片、背景图、支付方式）共用一份
export const GetDeliveryServiceQuerySchema = ServiceQuerySchema;
export type GetDeliveryServiceQuery = z.infer<typeof GetDeliveryServiceQuerySchema>;

export const DeliveryOrderTypeSchema = z.enum(["takeaway", "delivery"]);
export type DeliveryOrderType = z.infer<typeof DeliveryOrderTypeSchema>;

export const DeliveryControlSchema = z.object({
  takeaway_enable: z.boolean(), // 是否开放到店自取
  delivery_enable: z.boolean(), // 是否开放配送
  view_model_id: z.number().int(),
  business_hour_information_card: z.boolean(),
  price_information_card: z.boolean(),
  // 展示分组内菜品图片：true 时点击分组内菜品行切换显示该菜品的图片
  show_group_dish_image: z.boolean(),
});

// 自取 / 配送各自的营业时间
export const DeliveryHoursSchema = z.object({
  open_hours: z.array(OpenHourRowSchema),
  spacial_days: z.array(SpacialDayRowSchema),
  business_hour: BusinessHourSchema.nullable(),
});

export const DeliveryInfoCardSchema = z.object({
  id: z.number().int(),
  information_card_type_id: z.number().int(),
  enable: z.boolean(),
  weight: z.number().int(),
  icon: z.string().nullable(),
  service_delivery_information_card_title_multilingua: z.array(MultilinguaTextRowSchema),
  service_delivery_information_card_message_multilingua: z.array(MultilinguaTextRowSchema),
});

export const GetDeliveryServiceResponseSchema = z.object({
  control: DeliveryControlSchema.nullable(),
  takeaway: DeliveryHoursSchema,
  delivery: DeliveryHoursSchema,
  backgrounds: z.array(BackgroundRowSchema),
  info_cards: z.array(DeliveryInfoCardSchema),
  payment_types: z.array(PaymentTypeControlRowSchema),
});

export type GetDeliveryServiceResponse = z.infer<typeof GetDeliveryServiceResponseSchema>;
