import { z } from "zod";

// 自定义菜条件规则（custom_dish_constraint.rule 列的结构化内容）。
// 完整设计见仓库 docs/custom-dish-constraint-design.md。
// type 是判别字段，前后端都靠这个类型对齐 rule 的具体形状；不做外键校验，
// group_ids/item_ids 引用完整性由前端保证。

const RuleTargetsSchema = z.object({
  group_ids: z.array(z.number().int()).optional().default([]),
  item_ids:  z.array(z.number().int()).optional().default([]),
});

const VisibilityWhenSchema = z.object({
  // 触发方式二选一：item_id（选中某选项）或 quantity_gte + scope（累计数量达到阈值）
  item_id:        z.number().int().optional(),
  quantity_gte:   z.number().int().optional(),
  scope:          z.enum(["dish", "group"]).optional(),
  scope_group_id: z.number().int().optional(), // scope="group" 时必填，指定统计范围
});

const VisibilityThenSchema = z.object({
  show: RuleTargetsSchema.optional(),
  hide: RuleTargetsSchema.optional(),
});

// 类型一：可见性联动——选中某选项 / 累计数量达到阈值时，显示或隐藏若干分组/选项
export const VisibilityRuleSchema = z.object({
  type: z.literal("visibility"),
  when: VisibilityWhenSchema,
  then: VisibilityThenSchema,
});

// 类型二：跨分组数量上限——若干分组合计已选数量不能超过 max
export const QuantityLimitRuleSchema = z.object({
  type:  z.literal("quantity_limit"),
  scope: z.object({ group_ids: z.array(z.number().int()).min(1) }),
  max:   z.number().int().min(0),
  label: z.string().optional(),
});

// 判别联合：一条规则要么是 visibility 要么是 quantity_limit。
// 外层 refine 校验 visibility 规则内部 show/hide 目标集合不能有交集（自相矛盾的配置直接拒绝保存），
// 必须在 discriminatedUnion 组装完之后再 refine——refine 包一层 ZodEffects，
// 各分支子 schema 送进 discriminatedUnion 前必须还是纯 ZodObject。
export const CustomDishRuleSchema = z.discriminatedUnion("type", [
  VisibilityRuleSchema,
  QuantityLimitRuleSchema,
]).refine(
  (rule) => {
    if (rule.type !== "visibility") return true;
    const showGroups = new Set(rule.then.show?.group_ids ?? []);
    const hideGroups = new Set(rule.then.hide?.group_ids ?? []);
    const showItems  = new Set(rule.then.show?.item_ids  ?? []);
    const hideItems  = new Set(rule.then.hide?.item_ids  ?? []);
    const groupOverlap = [...showGroups].some(id => hideGroups.has(id));
    const itemOverlap  = [...showItems].some(id => hideItems.has(id));
    return !groupOverlap && !itemOverlap;
  },
  { message: "then.show 和 then.hide 不能指向同一个目标（group_id/item_id 有交集）" },
);
export type CustomDishRule = z.infer<typeof CustomDishRuleSchema>;
