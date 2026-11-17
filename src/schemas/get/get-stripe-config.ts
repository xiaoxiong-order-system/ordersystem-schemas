import { z } from "zod";

export const GetStripeConfigQuerySchema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
});

export type GetStripeConfigQuery = z.infer<typeof GetStripeConfigQuerySchema>;

export const GetStripeConfigResponseSchema = z.object({
  restaurantId: z.string(),
  /** 是否使用平台 Stripe */
  usePlatform: z.boolean(),
  /** 平台是否已配置 Stripe（环境变量）；false 时 usePlatform 不能生效 */
  platformAvailable: z.boolean(),
  /** 当前是否可用：(usePlatform && platformAvailable) || 已保存本店 Secret key */
  configured: z.boolean(),
  /** 脱敏后的 Secret key，如 sk_live_••••abcd；未保存为 null */
  secretKeyMasked: z.string().nullable(),
  /** 本店需要填到自己 Stripe Dashboard → Webhooks 的地址 */
  webhookUrl: z.string(),
});

export type GetStripeConfigResponse = z.infer<typeof GetStripeConfigResponseSchema>;
