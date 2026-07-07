import { z } from "zod";

// 自定义菜（custom_dish）下单选项，按分组嵌套；create-order / create-takeaway 共用
export const CustomDishItemSelectionSchema = z.object({
  custom_dish_item_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

export const CustomDishGroupSelectionSchema = z.object({
  custom_dish_group_id: z.number().int().positive(),
  items: z.array(CustomDishItemSelectionSchema).min(1),
});

export const CustomDishDetailInputSchema = z.array(CustomDishGroupSelectionSchema);

export type CustomDishItemSelection = z.infer<typeof CustomDishItemSelectionSchema>;
export type CustomDishGroupSelection = z.infer<typeof CustomDishGroupSelectionSchema>;
export type CustomDishDetailInput = z.infer<typeof CustomDishDetailInputSchema>;
