import { z } from "zod";

export const UpdateStripeConfigInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  /** true = 使用平台 Stripe；false = 使用本店 Secret key */
  usePlatform: z.boolean().optional(),
  /** 本店 Secret key（sk_... 或受限密钥 rk_...），保存前会向 Stripe 校验 */
  secretKey: z.string().min(1).regex(/^(sk|rk)_/).optional(),
  /** 清除本店 Secret key（不影响 usePlatform） */
  clear: z.literal(true).optional(),
}).refine((v) => v.clear === true || "usePlatform" in v || "secretKey" in v, {
  message: "At least one of usePlatform, secretKey, clear must be provided",
});

export type UpdateStripeConfigInput = z.infer<typeof UpdateStripeConfigInputSchema>;

export const UpdateStripeConfigResponseSchema = z.object({
  ok: z.literal(true),
  restaurantId: z.string(),
  usePlatform: z.boolean(),
  configured: z.boolean(),
});

export type UpdateStripeConfigResponse = z.infer<typeof UpdateStripeConfigResponseSchema>;
