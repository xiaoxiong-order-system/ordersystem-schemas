import { z } from "zod";

// 转桌/转菜：把选中的 order_item 从源桌台当前批次转移到目标桌台。完整行为说明
// 见 supabase/functions/transfer-order-items/README.md，这里只记前端接入时
// 容易忽略的几点：
//
// 1. 目标桌台永远新建一个 order，即使当前批次已经有订单也不会复用/追加。
// 2. 不会触发任何打印。
// 3. 只支持整行转移，不支持拆分数量。
// 4. 只允许同一个 restaurant_id 内部转移，不支持跨餐厅（即使物理桌台共享）。
// 5. 鉴权双层：平台身份需为 merchant/admin；merchant 还需对 restaurant_id 有
//    order.update 权限（系统模板角色里 boss/manager 默认有，staff 默认没有——
//    "转桌"入口对 staff 账号应默认隐藏/禁用）。

export const TransferOrderItemsInputSchema = z.object({
  // 菜品实际归属的餐厅 id（父/子餐厅共用桌台时，传菜品自己的 restaurant_id，
  // 不是桌台所属的父餐厅 id）
  restaurant_id:         z.number().int().positive(),
  source_table_id:       z.number().int().positive(),
  destination_table_id:  z.number().int().positive(),
  // 要转移的 order_item.id 列表；选中主菜/赠品其中一方，另一方（parent_item_id
  // 关联的父子闭包）会被后端自动一起转移，不需要前端自己算清楚这层关系——
  // 响应里的 moved_item_ids 可能比这里传的多
  order_item_ids:        z.array(z.number().int().positive()).min(1),
}).refine(
  (data) => data.source_table_id !== data.destination_table_id,
  { message: "source_table_id and destination_table_id must differ" },
).refine(
  (data) => new Set(data.order_item_ids).size === data.order_item_ids.length,
  { message: "order_item_ids must not contain duplicates" },
);
export type TransferOrderItemsInput = z.infer<typeof TransferOrderItemsInputSchema>;

export const TransferOrderItemsResponseSchema = z.object({
  new_order_id:        z.number().int(), // 目标桌台新建的 order id（永远是新建的，不会是已有 order）
  new_order_record_no: z.number().int(),
  // 实际转移的全部 order_item id，含自动带上的父子闭包项，可能是请求里
  // order_item_ids 的超集
  moved_item_ids:       z.array(z.number().int()),
});
export type TransferOrderItemsResponse = z.infer<typeof TransferOrderItemsResponseSchema>;
