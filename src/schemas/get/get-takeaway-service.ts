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

export const GetTakeawayServiceQuerySchema = ServiceQuerySchema;
export type GetTakeawayServiceQuery = z.infer<typeof GetTakeawayServiceQuerySchema>;

export const TakeawayControlSchema = z.object({
  enable: z.boolean(),
  view_model_id: z.number().int(),
  business_hour_information_card: z.boolean(),
  price_information_card: z.boolean(),
});

export const TakeawayInfoCardSchema = z.object({
  id: z.number().int(),
  information_card_type_id: z.number().int(),
  enable: z.boolean(),
  weight: z.number().int(),
  icon: z.string().nullable(),
  service_takeaway_information_card_title_multilingua: z.array(MultilinguaTextRowSchema),
  service_takeaway_information_card_message_multilingua: z.array(MultilinguaTextRowSchema),
});

export const GetTakeawayServiceResponseSchema = z.object({
  control: TakeawayControlSchema.nullable(),
  open_hours: z.array(OpenHourRowSchema),
  spacial_days: z.array(SpacialDayRowSchema),
  business_hour: BusinessHourSchema.nullable(),
  backgrounds: z.array(BackgroundRowSchema),
  info_cards: z.array(TakeawayInfoCardSchema),
  payment_types: z.array(PaymentTypeControlRowSchema),
});

export type GetTakeawayServiceResponse = z.infer<typeof GetTakeawayServiceResponseSchema>;
