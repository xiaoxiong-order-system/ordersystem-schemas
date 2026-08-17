import { z } from "zod";

// 转桌/转菜：把选中的 order_item（可以只转其中一部分数量）从源桌台当前批次
// 转移到目标桌台。完整行为说明见
// supabase/functions/transfer-order-items/README.md，这里只记前端接入时
// 容易忽略的几点：
//
// 1. 目标桌台永远新建一个 order，即使当前批次已经有订单也不会复用/追加。
// 2. 不会触发任何打印。
// 3. 支持部分数量转移（items[].quantity 可以小于该 order_item 当前的全部
//    数量），但如果这个 order_item 带有存活的父项/子项（parent_item_id 关联，
//    典型如"随单赠品"），只要对方数量还大于 0，就不允许拆分数量转移，必须
//    整份一起转移；只有对方数量已经是 0（没有存活关联了）时才能拆分。
//    整份转移一方时，还存活的另一方会被自动整份一起带走，不需要调用方
//    自己把父子都列进 items。
// 4. 只允许同一个 restaurant_id 内部转移，不支持跨餐厅（即使物理桌台共享）。
// 5. 鉴权双层：平台身份需为 merchant/admin；merchant 还需对 restaurant_id 有
//    order.update 权限（系统模板角色里 boss/manager 默认有，staff 默认没有——
//    "转桌"入口对 staff 账号应默认隐藏/禁用）。

const TransferItemEntrySchema = z.object({
  order_item_id: z.number().int().positive(),
  // 要转移的数量，必须 <= 该 order_item 当前的数量；等于当前数量 = 整份转移，
  // 小于 = 拆分转移（受上面第 3 条父子存活规则限制）
  quantity:      z.number().int().positive(),
});

export const TransferOrderItemsInputSchema = z.object({
  // 菜品实际归属的餐厅 id（父/子餐厅共用桌台时，传菜品自己的 restaurant_id，
  // 不是桌台所属的父餐厅 id）
  restaurant_id:         z.number().int().positive(),
  source_table_id:       z.number().int().positive(),
  destination_table_id:  z.number().int().positive(),
  // 要转移的明细列表，每条指定 order_item_id + 要转移的数量。选中主菜/赠品
  // 其中一方且是整份转移时，另一方（parent_item_id 关联的父子闭包，若也是
  // 整份存活）会被后端自动一起转移，不需要前端自己把两边都列出来——响应里
  // 的 moved_items 可能比这里传的多
  items: z.array(TransferItemEntrySchema).min(1),
}).refine(
  (data) => data.source_table_id !== data.destination_table_id,
  { message: "source_table_id and destination_table_id must differ" },
).refine(
  (data) => new Set(data.items.map(i => i.order_item_id)).size === data.items.length,
  { message: "items must not contain duplicate order_item_id" },
);
export type TransferOrderItemsInput = z.infer<typeof TransferOrderItemsInputSchema>;

const MovedItemSchema = z.object({
  // 目标 order 下最终这条明细的 id：整份转移=原 order_item.id 不变（只是
  // order_id 换了）；拆分转移=新生成的一条 order_item（源桌台那边原来的
  // order_item 还在，只是数量减少了）
  order_item_id: z.number().int(),
  quantity:      z.number().int(),
});

export const TransferOrderItemsResponseSchema = z.object({
  new_order_id:        z.number().int(), // 目标桌台新建的 order id（永远是新建的，不会是已有 order）
  new_order_record_no: z.number().int(),
  // 实际转移的全部明细，含自动带上的父子闭包项，可能比请求里的 items 多
  moved_items: z.array(MovedItemSchema),
});
export type TransferOrderItemsResponse = z.infer<typeof TransferOrderItemsResponseSchema>;
