// manage-saas-products — 管理 SaaS 订阅套餐目录（列出全部套餐 / 新建或更新一个套餐）
//
// Method: POST /functions/v1/manage-saas-products
// 调用方: 管理端（商家后台的平台管理员）
// 认证: 需要登录；`action:"list"` 只需登录即可（返回全部套餐，含未上架的），
//       `action:"upsert"` 额外要求调用者是平台管理员（public.user_role 关联 role.name='admin'），否则 403
//
// 非显而易见的行为：
// 1. `saas_products.key` / `monthly_price_id` / `yearly_price_id` 都是唯一约束，
//    upsert 时如果和别的套餐冲突会返回 409。
// 2. `stripe_*_price_id_dev` / `stripe_*_price_id_live` 是 Stripe 后台创建的真实
//    Price ID（`price_xxx`），需要先在 Stripe Dashboard/API 建好 Price 对象再填
//    进来；这几个字段允许为空（未接通 Stripe 前套餐仍可展示定价，但 create-checkout
//    在对应 environment 下没有该字段时会直接报错，不能发起真实结账）。
// 3. `upsert` 不传 `id` 时是新建（`id` 由数据库生成），传 `id` 时是更新且必须是
//    已存在的行，否则 404。
// 4. `features_*` 是字符串数组（jsonb），`trial_config` 是按 `"<tier>_<period>"`
//    （如 `free_monthly` / `basic_yearly`）为 key 的对象，value 形如
//    `{enabled: boolean, days: number}`，两者都不做深层结构校验，只校验顶层类型。
//
// 成功响应（200）：
// - `list` → `{ products: SaasProduct[] }`（按 `sort_order` 升序）
// - `upsert` → `{ product: SaasProduct }`
// 错误码：400（校验失败）/ 401（未登录）/ 403（`upsert` 非管理员）/ 404（`upsert` 指定的
// `id` 不存在）/ 409（`key`/`monthly_price_id`/`yearly_price_id` 冲突）/ 500（数据库错误）

import { z } from "zod";

const SaasProductSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().min(1),
  name_pt: z.string().default(""),
  name_en: z.string().default(""),
  name_cn: z.string().default(""),
  description_pt: z.string().default(""),
  description_en: z.string().default(""),
  description_cn: z.string().default(""),
  features_pt: z.array(z.string()).default([]),
  features_en: z.array(z.string()).default([]),
  features_cn: z.array(z.string()).default([]),
  monthly_price: z.number().nonnegative().default(0),
  yearly_price: z.number().nonnegative().default(0),
  monthly_original_price: z.number().nonnegative().nullable().optional(),
  yearly_original_price: z.number().nonnegative().nullable().optional(),
  monthly_discount_label: z.string().nullable().optional(),
  yearly_discount_label: z.string().nullable().optional(),
  monthly_price_id: z.string().min(1),
  yearly_price_id: z.string().min(1),
  stripe_monthly_price_id_dev: z.string().nullable().optional(),
  stripe_monthly_price_id_live: z.string().nullable().optional(),
  stripe_yearly_price_id_dev: z.string().nullable().optional(),
  stripe_yearly_price_id_live: z.string().nullable().optional(),
  trial_days: z.number().int().nonnegative().default(0),
  trial_config: z.record(z.string(), z.unknown()).default({}),
  is_active: z.boolean().default(true),
  is_bundle: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  icon: z.string().default("Package"),
  color_gradient: z.string().default("from-muted to-muted"),
});

export const ManageSaasProductsInputSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("list") }),
  z.object({ action: z.literal("upsert"), product: SaasProductSchema }),
]);

export type ManageSaasProductsInput = z.infer<typeof ManageSaasProductsInputSchema>;
export type SaasProduct = z.infer<typeof SaasProductSchema>;
