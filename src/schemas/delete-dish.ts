import { z } from "zod";

export const DeleteDishInputSchema = z.object({
  dish_id: z.number().int().positive(),
  // 该菜品被其他菜品设为"关联菜品"（sdr_id/linked_dish）时默认阻止删除；
  // force:true 会先解除那些引用（置 NULL），再继续删除本菜品
  force: z.boolean().optional().default(false),
});
export type DeleteDishInput = z.infer<typeof DeleteDishInputSchema>;

export const DeleteDishResponseSchema = z.object({
  ok: z.literal(true),
  dish_id: z.number().int(),
  restaurant_id: z.number().int(),
  sku: z.string(),
  image: z.string().nullable(),
  had_custom_dish: z.boolean(),
  unlinked_reference_count: z.number().int(),
});
export type DeleteDishResponse = z.infer<typeof DeleteDishResponseSchema>;
