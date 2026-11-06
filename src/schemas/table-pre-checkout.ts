import { z } from "zod";
import { LineDiscountSchema, PeopleDiscountSchema } from "./table-checkout.ts";

// table-pre-checkout：打印预结账单（剩余未结的全部菜品 + 人头费）
export const PreCheckoutInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  table_id: z.number().int().positive(),
  table_start_time: z.number().int(),
  printer_id: z.number().int().positive(),
  // 整单折扣，与 table-checkout 同口径：后端用 calcDiscount 自己算折扣金额，
  // 基数是扣完单行折扣后的剩余全部金额（people_percentage 的基数是扣完单行折扣后的人头费）
  discount_type: z.enum(["percentage", "fixed", "free", "people_percentage"]).optional(),
  discount_value: z.number().nonnegative().optional(),
  // 过渡期兼容：旧版管理端直接传算好的整单折扣金额。仅在没传 discount_type 时使用，
  // 管理端改成传 discount_type/discount_value 后删除
  discount_amount: z.number().nonnegative().optional(),
  tip_amount: z.number().nonnegative().optional(),
  // 单行折扣（与 table-checkout 同结构），体现在小票行上；整单折扣在此基础上再算
  line_discounts: z.array(LineDiscountSchema).optional(),
  people_discounts: z.array(PeopleDiscountSchema).optional(),
});

export type PreCheckoutInput = z.infer<typeof PreCheckoutInputSchema>;

export const PreCheckoutPrintItemSchema = z.object({
  sku: z.string(),
  name: z.string().nullable(),
  price: z.number(),
  quantity: z.number(),
  discount: z.number().nullable(),
  note: z.string().nullable(),
  tax_rate: z.number().nullable(),
});

export const PreCheckoutResponseSchema = z.object({
  // 扣完单行折扣后的剩余全部金额（整单折扣的基数）
  total_amount: z.number(),
  // 整单折扣金额（后端按 discount_type/discount_value 算出，不含单行折扣）
  discount_amount: z.number(),
  tip_amount: z.number(),
  // total_amount - discount_amount + tip_amount
  final_amount: z.number(),
  items: z.array(PreCheckoutPrintItemSchema),
  print_success: z.boolean(),
  print_message: z.string(),
});

export type PreCheckoutResponse = z.infer<typeof PreCheckoutResponseSchema>;
