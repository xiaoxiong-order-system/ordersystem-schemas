import { z } from "zod";

export const DeleteDishGroupInputSchema = z.object({
  dish_group_id: z.number().int().positive(),
});
export type DeleteDishGroupInput = z.infer<typeof DeleteDishGroupInputSchema>;

export const DeleteDishGroupResponseSchema = z.object({
  ok: z.literal(true),
  dish_group_id: z.number().int(),
  restaurant_id: z.number().int(),
  image: z.string().nullable(),
  // 该分组在 view_sort 中被清理的行数（含"标签下的分组排序"和"分组内菜品归属/排序"）
  removed_view_sort_count: z.number().int(),
});
export type DeleteDishGroupResponse = z.infer<typeof DeleteDishGroupResponseSchema>;
