import { z } from "zod";

// dish_price — 菜品价格表（唯一权威计价来源）
//
// 不对应任何边缘函数，前端直接用 supabase-js 读写这张表（走 RLS，复用
// dish.read/create/update/delete 权限码，见 permissions.ts）。这里描述的
// 是"数据结构 + 解析规则"本身，不是某个请求/响应的形状。
//
// 两种行：
// - 基准价行（weekday IS NULL）：不限时段，一直生效，price 可为 NULL（= 该渠道
//   未定价，此时 discount 也必须为 NULL），0 = 明确 0 元。每个
//   dish_id + sale_channel 最多一条（唯一索引）。由 create_dish /
//   create_custom_dish / update_custom_dish / update_dish 的 p_price_rows
//   参数直接写入（PUT 全量替换语义）——过渡期那个从 dish 四个旧价格字段
//   镜像同步的触发器 tr_sync_dish_price_base 已拆除，dish 的四列也已物理删除。
// - 覆盖行（weekday 非空）：按 sale_channel + weekday + [start_time,
//   end_time) 生效，price 必填（0 = 该时段 0 元），discount 可选。不支持只填
//   discount：解析时不跨行合并字段，这种行无法按"沿用基准价、只改折扣"生效。
//
// sale_channel：NULL = 不限渠道（各渠道都适用）；否则取 sale_channel 表的
// code。**这里不写死可选值**——渠道是数据库里的数据、不是代码常量，往
// sale_channel 表插一行新渠道不应该连带改这份 schema。需要给用户列出可选
// 渠道时，查 sale_channel 表，不要在前端硬编码。
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
//      sale_channel 是按渠道各建一条的基准行（每个渠道一条），不是
//      管理员主动选的"更具体"配置，不参与这项比较。
//
//   ② price 非 NULL 的行优先于 price 为 NULL 的行
//      price 语义：NULL = 未定价，0 = 明确定价 0 元（如自助餐范围内的菜品），
//      >0 = 正常价格。0 是有效价格，不降级。只有基准价行允许 price 为 NULL
//      （覆盖行 price 必填，不支持只填 discount，由 dish_price_check 约束保证）。
//      最终胜出行 price 仍为 NULL（该渠道未定价且没有命中的覆盖行）时，
//      resolveDishPrices 不返回这道菜，下单接口按"未定价"报错，绝不当 0 元。
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
  sale_channel:  z.string().nullable(),                     // NULL = 不限渠道；否则是 sale_channel.code（不写死枚举，见文件头）
  price:         z.number().nullable(),                     // NULL = 未定价（仅基准价行允许）；0 = 0 元；覆盖行必填，见上方②
  discount:      z.number().nullable(),                     // 百分比，语义同 dish.discount
  weekday:       z.string().nullable(),                     // NULL = 基准价行；否则 'monday'..'sunday'/'holiday'
  start_time:    z.string().nullable(),                     // "HH:MM:SS"；基准价行为 NULL
  end_time:      z.string().nullable(),                     // "HH:MM:SS"；基准价行为 NULL
  enable:        z.boolean(),
});
export type DishPriceRow = z.infer<typeof DishPriceRowSchema>;
