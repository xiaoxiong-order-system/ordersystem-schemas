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

// 结账时的单行折扣：在菜品自带折扣（order_item.discount）之上再额外叠加的百分比折扣，
// 只作用于本次结算的数量。order_item_id 必须是本次结算的菜品（order_item_selections
// 里选中的，或未传 selections 时剩余全部）之一
export const LineDiscountSchema = z.object({
  order_item_id: z.number().int().positive(),
  percent: z.number().min(0).max(100),
});

// 结账时的人头费折扣：对 people_type 里指定人数（count，不超过本次结算的人数）打
// percent 折，其余人头不打折。结账记录/发票上打折与不打折的人头拆成两行
export const PeopleDiscountSchema = z.object({
  people_type_id: z.number().int().positive(),
  percent: z.number().min(0).max(100),
  count: z.number().int().positive(),
});

// 结账记录商品明细快照（table_payment.items_snapshot 的元素），供结账记录详情和补开
// 发票按"本次结算的商品"展示/开票；部分结账时只含本次结的商品
export const ItemsSnapshotItemSchema = z.object({
  order_item_id: z.number().int().positive(),
  name: z.string().nullable(),
  dish_sku: z.string().nullable(),
  price: z.number(),
  discount: z.number().nullable(),
  quantity: z.number().int().positive(),
  tax_rate: z.string().nullable(),
  line_discount_percent: z.number().min(0).max(100),
});
export type ItemsSnapshotItem = z.infer<typeof ItemsSnapshotItemSchema>;

// 人头费明细快照（table_payment.people_breakdown），供 issue-table-invoice
// 补开发票时按类型分行使用；与 people_amount（合计）并存
export const PeopleBreakdownItemSchema = z.object({
  people_type_id: z.number().int().positive(),
  type_name: z.string(),
  unit_price: z.number(),
  count: z.number().int().nonnegative(),
  subtotal: z.number(),
  // 这部分人头的结账折扣（0-100），缺省/0 = 未打折
  discount_percent: z.number().min(0).max(100).optional(),
});
export type PeopleBreakdownItem = z.infer<typeof PeopleBreakdownItemSchema>;

export const CheckoutInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
  table_id: z.number().int().positive(),
  table_start_time: z.number().int(),
  // people_percentage：只对人头费按比例打折（discount_value 0-100），折扣基数
  // 是人头费小计而不是「商品+人头费」合计，其余三种类型基数不变
  discount_type: z.enum(["percentage", "fixed", "free", "people_percentage"]).optional(),
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
  // 单行折扣：菜品按 order_item、人头费按 people_type（可只打折部分人数）。
  // 与 discount_type/discount_value（整单折扣）叠加：先扣单行折扣，整单折扣的基数是扣完
  // 单行折扣后的金额；table_payment.discount_amount = 单行折扣合计 + 整单折扣
  line_discounts: z.array(LineDiscountSchema).optional(),
  people_discounts: z.array(PeopleDiscountSchema).optional(),
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
