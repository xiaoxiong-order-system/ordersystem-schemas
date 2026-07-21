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

export const GetDineinServiceQuerySchema = ServiceQuerySchema;
export type GetDineinServiceQuery = z.infer<typeof GetDineinServiceQuerySchema>;

export const DineinControlSchema = z.object({
  table_cooling_time: z.number().int(),
  client_cooling_time: z.number().int(),
  table_order_use_password: z.boolean(),
  ai_recommended: z.boolean(),
  view_model_id: z.number().int(),
  enable: z.boolean(),
  business_hour_information_card: z.boolean(),
  price_information_card: z.boolean(),
  check_ip: z.boolean(),
});

export const DineinInfoCardSchema = z.object({
  id: z.number().int(),
  information_card_type_id: z.number().int(),
  enable: z.boolean(),
  weight: z.number().int(),
  icon: z.string().nullable(),
  service_order_information_card_title_multilingua: z.array(MultilinguaTextRowSchema),
  service_order_information_card_message_multilingua: z.array(MultilinguaTextRowSchema),
});

export const GetDineinServiceResponseSchema = z.object({
  control: DineinControlSchema.nullable(),
  information: z.object({ acknowledgement: z.string().nullable() }).nullable(),
  open_hours: z.array(OpenHourRowSchema),
  spacial_days: z.array(SpacialDayRowSchema),
  business_hour: BusinessHourSchema.nullable(),
  backgrounds: z.array(BackgroundRowSchema),
  info_cards: z.array(DineinInfoCardSchema),
  payment_types: z.array(PaymentTypeControlRowSchema),
});

export type GetDineinServiceResponse = z.infer<typeof GetDineinServiceResponseSchema>;
