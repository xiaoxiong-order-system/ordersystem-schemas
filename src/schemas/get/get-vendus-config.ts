import { z } from "zod";

export const GetVendusConfigQuerySchema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
});

export type GetVendusConfigQuery = z.infer<typeof GetVendusConfigQuerySchema>;

// CENTER_API 未配置时的 configured:false 分支只有这一个字段；
// 配置存在时 CENTER_API 会额外透传 Vendus 返回的字段（结构由 CENTER_API 决定，此处不强绑定）
export const GetVendusConfigResponseSchema = z.object({
  configured: z.boolean(),
}).passthrough();

export type GetVendusConfigResponse = z.infer<typeof GetVendusConfigResponseSchema>;
