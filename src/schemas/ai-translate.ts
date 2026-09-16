import { z } from "zod";

export const TranslateSourceItemSchema = z.object({
  language: z.string().min(1),
  context: z.string().min(1),
});

export const AiTranslateInputSchema = z.object({
  // 同一段意思的多语言版本，互为参照，帮助模型更准确地理解原意
  source: z.array(TranslateSourceItemSchema).min(1),
  // 目标翻译语言代码列表
  target_languages: z.array(z.string().min(1)).min(1),
});

export type TranslateSourceItem = z.infer<typeof TranslateSourceItemSchema>;
export type AiTranslateInput = z.infer<typeof AiTranslateInputSchema>;

export const TranslateResultItemSchema = z.object({
  language: z.string(),
  context: z.string(),
});

export const AiTranslateResponseSchema = z.object({
  translations: z.array(TranslateResultItemSchema),
});

export type TranslateResultItem = z.infer<typeof TranslateResultItemSchema>;
export type AiTranslateResponse = z.infer<typeof AiTranslateResponseSchema>;
