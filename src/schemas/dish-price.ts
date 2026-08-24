import { z } from "zod";

// dish_price — 菜品价格表（唯一权威计价来源）
//
// 不对应任何边缘函数，前端直接用 supabase-js 读写这张表（走 RLS，复用
// dish.read/create/update/delete 权限码，见 permissions.ts）。这里描述的
// 是"数据结构 + 解析规则"本身，不是某个请求/响应的形状。
//
// 两种行：
// - 基准价行（weekday IS NULL）：不限时段，一直生效，price 必填。每个
//   dish_id + sale_channel 最多一条（唯一索引）。目前由数据库触发器
//   tr_sync_dish_price_base 根据 dish.price/discount/delivery_price/
//   delivery_discount 自动同步生成，前端不需要、也不应该手动写这种行——
//   这是过渡期的兼容层，等前端切到直接维护 dish_price 后会拆掉。
// - 覆盖行（weekday 非空）：按 sale_channel + weekday + [start_time,
//   end_time) 生效，price/discount 至少填一个（可以只填 discount，
//   但见下方"多条命中"里 price 缺失的实际后果）。
//
// sale_channel：NULL = 不限渠道（堂食/外卖都适用）；否则是 'dinein'/'delivery'。
//
// ── 多条命中时怎么选：唯一权威规则 ──────────────────────────────────
//
// 后端下单/查询价格时（_shared/dishPrice.ts 的 resolveDishPrices），会把
// 某一时刻【所有命中的行（基准价行 + 覆盖行）】放进同一个池子，按下面的
// 顺序排序，取整体排名第一的那一行，**直接使用这一行自己的 price/discount**
// ——不会跨行合并字段（比如"这行的 price 配那行的 discount"这种拼接不存在）。
//
//   ① 渠道精确匹配优先于不限渠道
//      sale_channel 精确等于当前下单渠道的行，优先于 sale_channel IS NULL
//      的行。——但这条只在两条都是"覆盖行"时才比较；基准价行的
//      sale_channel 是触发器按渠道拆出来的固定行（每个渠道一条），不是
//      管理员主动选的"更具体"配置，不参与这项比较。
//
//   ② price 有效的行优先于 price 为空或 0 的行
//      "有效"= price 不是 NULL 且不是 0。这条优先级很高，几乎总是排在
//      时间窗口比较之前——一条只填了 discount、没填 price 的覆盖行，
//      不管它的时间窗口配得多窄，只要还有别的候选行 price 有效，就赢不了。
//      只有当它是唯一命中的行时才会被选中兜底，此时最终返回的 price
//      视为 0（不会向别的行借 price）。
//
//   ③ 时间窗口越短优先
//      按 (end_time - start_time) 升序排，窗口越短排越前。基准价行没有
//      时间限制，视为"无限长"，天然排在所有有时间限制的覆盖行之后。
//      例：同一天配了"全天 9 折"和"12:00-14:00 再加 5 折"，后者窗口更
//      窄，命中时优先用后者。
//
//   ④ 窗口时长也相同时，discount 有填的行优先于没填的
//
//   ⑤ 以上仍然打平（几乎不会发生），取 start_time 最晚的一条
//
// 例子（假设都命中同一时刻）：
//   1. 基准价行：price=10，无时间限制
//   2. 覆盖行：price=2，每周六 13:00-14:00（1 小时窗口）
//   3. 覆盖行：price=4，discount=10，每周一全天（24 小时窗口）
//   优先级：2 > 3 > 1 —— 2 的窗口最窄；3 比 1 窄（24 小时 < 无限）。
//   （注：2 和 3 实际上是不同 weekday，不会真的同时命中；这里只是用来
//   说明排序规则本身，不代表这两条会在同一次查询里被同时比较。）
export const DishPriceRowSchema = z.object({
  id:            z.number().int(),
  dish_id:       z.number().int(),
  restaurant_id: z.number().int(),
  sale_channel:  z.enum(["dinein", "delivery"]).nullable(), // NULL = 不限渠道
  price:         z.number().nullable(),                     // 基准价行必填；覆盖行可为空（会被判定为"无效"，见上方②）
  discount:      z.number().nullable(),                     // 百分比，语义同 dish.discount
  weekday:       z.string().nullable(),                     // NULL = 基准价行；否则 'monday'..'sunday'/'holiday'
  start_time:    z.string().nullable(),                     // "HH:MM:SS"；基准价行为 NULL
  end_time:      z.string().nullable(),                     // "HH:MM:SS"；基准价行为 NULL
  enable:        z.boolean(),
});
export type DishPriceRow = z.infer<typeof DishPriceRowSchema>;
