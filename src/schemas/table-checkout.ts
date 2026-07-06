import { z } from "zod";

export const PaymentItemInputSchema = z.object({
  payment_type_code: z.string().min(1),
  amount: z.number().nonnegative(), // 不含小费
  tip_amount: z.number().nonnegative().optional(),
});

const printConfigBase = z.object({
  clientId: z.string().min(1),
  paperWidth: z.union([z.literal(58), z.literal(80), z.literal(100)]),
  dpi: z.union([z.literal(203), z.literal(300)]),
  printableWidthMm: z.number().optional(),
});

// mode=ip 必须提供 host（port 默认 9100）；mode=driver 必须提供 printerId
export const PrintConfigSchema = z.discriminatedUnion("mode", [
  printConfigBase.extend({
    mode: z.literal("ip"),
    host: z.string().min(1),
    port: z.number().int().optional(),
  }),
  printConfigBase.extend({
    mode: z.literal("driver"),
    printerId: z.string().min(1),
  }),
]);

export const CheckoutInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  table_id: z.number().int().positive(),
  table_start_time: z.number().int(),
  discount_type: z.enum(["percentage", "fixed", "free"]).optional(),
  discount_value: z.number().optional(),
  tip_amount: z.number().nonnegative().optional(),
  payment_items: z.array(PaymentItemInputSchema).min(1),
  nif: z.string().optional(),
  customer_name: z.string().optional(),
  note: z.string().optional(),
  created_by: z.string().uuid().optional(),
  // 提供则在结账后打印 Vendus 发票（ESC/POS 小票）
  print_config: PrintConfigSchema.optional(),
});

export type PaymentItemInput = z.infer<typeof PaymentItemInputSchema>;
export type PrintConfig = z.infer<typeof PrintConfigSchema>;
export type CheckoutInput = z.infer<typeof CheckoutInputSchema>;

export const PrintResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const CheckoutResponseSchema = z.object({
  payment_id: z.number().int(),
  total_amount: z.number(),
  people_amount: z.number(),
  discount_amount: z.number(),
  tip_amount: z.number(),
  final_amount: z.number(),
  invoice_status: z.string(),
  invoice_ref: z.string().nullable(),
  print_result: PrintResultSchema.nullable(),
});

export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;
