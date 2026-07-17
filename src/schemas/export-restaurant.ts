import { z } from "zod";

export const ExportRestaurantInputSchema = z.object({
  restaurant_id: z.number().int().positive(),
});
export type ExportRestaurantInput = z.infer<typeof ExportRestaurantInputSchema>;

// info/services/menu 内部字段很多、变动频繁，这里不做逐字段深度建模，用
// z.record(z.string(), z.unknown()) 保留"是个对象"这一层类型安全（不是 any）。
// 真正需要强约束、这次教训要补的是顶层契约（restaurant_code 匹配、递归的
// sub_restaurants 结构），深层字段留给具体读代码时人工核对。
const LooseRecord = z.record(z.string(), z.unknown());

export interface ExportRestaurantData {
  restaurant_id: number;
  restaurant_code: string;
  restaurant_description: string | null;
  info: Record<string, unknown>;
  services: Record<string, unknown>;
  tables: Record<string, unknown>[];
  menu: Record<string, unknown>;
  permissions: string[];
  sub_restaurants?: ExportRestaurantData[];
}

// sub_restaurants 递归嵌套自身结构，zod 递归 schema 需要 z.lazy + 显式类型标注
// （TS 无法从 z.lazy 自动反推递归类型）
export const ExportRestaurantDataSchema: z.ZodType<ExportRestaurantData> = z.lazy(() =>
  z.object({
    restaurant_id: z.number().int(),
    restaurant_code: z.string(),
    restaurant_description: z.string().nullable(),
    info: LooseRecord,
    services: LooseRecord,
    tables: z.array(LooseRecord),
    menu: LooseRecord,
    permissions: z.array(z.string()),
    sub_restaurants: z.array(ExportRestaurantDataSchema).optional(),
  })
);

export const ExportRestaurantResponseSchema = z.object({
  ok: z.literal(true),
  data: ExportRestaurantDataSchema,
});
export type ExportRestaurantResponse = z.infer<typeof ExportRestaurantResponseSchema>;
