import { z } from "zod";

export const GetTagsQuerySchema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  type: z.string().optional(), // 精确按 tag.type 过滤（allergen/property/view，print 恒被排除）
  lang: z.string().optional(), // 提供时只返回该语言文本，且不含 multilingua 数组
  with_dishes: z.union([z.literal("true"), z.literal("false")]).optional(),
});

export type GetTagsQuery = z.infer<typeof GetTagsQuerySchema>;

export const TagMultilinguaRowSchema = z.object({
  language_code: z.string(),
  text: z.string().nullable(),
});

export const TagEntrySchema = z.object({
  id: z.number().int(),
  text: z.string(),
  type: z.string(),
  image: z.string().nullable(),
  is_system: z.boolean(),
  is_global: z.boolean(), // restaurant_id === null
  multilingua: z.array(TagMultilinguaRowSchema).optional(), // lang 参数提供时不返回
  dish_ids: z.array(z.number().int()).optional(), // with_dishes=true 时才有
});

export type TagEntry = z.infer<typeof TagEntrySchema>;

export const GetTagsResponseSchema = z.object({
  tags: z.array(TagEntrySchema),
});

export type GetTagsResponse = z.infer<typeof GetTagsResponseSchema>;
