import { z } from "zod";

export const PaymentItemInputSchema = z.object({
  payment_type_code: z.string().min(1),
  // 不含小费；仅 payment_type_code="cash" 的条目允许省略（且最多一条），
  // 省略时后端按剩余应付余额自动补齐差额（见 table-checkout 业务逻辑）
  amount: z.number().nonnegative().optional(),
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

// 部分结账用：只结这些 order_item 的指定数量，不传（undefined）则结清当前批次
// 剩余全部（向后兼容旧行为）；传空数组 [] 则显式表示"本次不结任何菜品"，跟不传
// 语义不同，不能用 min(1) 卡掉。quantity 不能超过该行剩余可结数量
// （quantity - settled_quantity）
export const OrderItemSelectionSchema = z.object({
  order_item_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

// 部分结账用：人头费（couvert）按 people_type 分别指定要结的人数，不传
// （undefined）则结清当前批次剩余全部人头费类型；传空数组 [] 则显式表示"本次不
// 收人头费"，跟不传语义不同。count 不能超过该类型剩余可结人数
// （restaurant_table_people_count.count - settled_count）。与
// order_item_selections 相互独立，可以只传一个、都传或都不传
export const PeopleSelectionSchema = z.object({
  people_type_id: z.number().int().positive(),
  count: z.number().int().positive(),
});

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
  // 部分结账：只传部分 order_item，不传（undefined）则结清当前批次剩余全部
  // 菜品；传 [] 则本次不结任何菜品
  order_item_selections: z.array(OrderItemSelectionSchema).optional(),
  // 部分结账：人头费按 people_type 只传部分人数，不传（undefined）则结清当前
  // 批次剩余全部人头费；传 [] 则本次不收人头费（per_person 模式下生效，
  // per_item 模式下无意义会被忽略）
  people_selections: z.array(PeopleSelectionSchema).optional(),
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
  // 本次结账后，当前批次是否已全部结清（菜品 + 人头费）。true 时桌台已
  // 被重置为 available；false 表示还有剩余未结，桌台仍是 occupied，
  // 可以继续下单/继续结账剩余部分
  table_closed: z.boolean(),
});

export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;
