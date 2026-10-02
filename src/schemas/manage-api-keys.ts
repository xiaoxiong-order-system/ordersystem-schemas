// manage-api-keys — 平台管理员管理外部平台及其 API key（函数目录 / 平台 / key / 可调用函数 / 可操作餐厅）
//
// Method: POST /functions/v1/manage-api-keys
// 调用方: 管理端（商家后台的平台管理员）
// 认证: 需要登录且是平台管理员（public.user_role 关联 role.name='admin'），否则 403；所有 action 都要求 admin
//
// 非显而易见的行为：
// 1. key 明文只在 `create_key` 的响应里返回一次（`api_key` 字段），数据库只存 SHA-256 哈希，之后无法再取回。
// 2. api_key 故意不挂 tr_set_updated_at（verify_api_key 每分钟会写 last_used_at），
//    所以对 key 的任何配置修改（update_key / set_key_functions / set_key_restaurants / revoke_key）
//    都由本函数手动写 updated_at；api_client 的 updated_at 由触发器维护。
// 3. `set_key_functions` / `set_key_restaurants` 是整体替换（PUT 语义）：先删掉不在新列表里的，
//    再补上新增的，中间态只会是新旧列表的交集，不会出现权限超出新旧任一列表的窗口。
// 4. 已吊销（revoked_at 非空）的 key 不可再修改，返回 409；吊销不可恢复，需要时重新生成。
// 5. key 只能授权函数目录（api_function）里登记过的函数：`create_key` / `set_key_functions`
//    里有未登记的函数名返回 400。目录里 enable=false 的函数可以授权，但校验时不生效，重新开放后自动恢复。
//    目录不删行，停止开放用 `update_function` 把 enable 设为 false。
//
// 成功响应（200）：
// - `list`                → `{ clients: ApiClientWithKeys[] }`
// - `list_functions`      → `{ functions: ApiFunction[] }`（按 name 升序）
// - `create_function` / `update_function` → `{ function: ApiFunction }`
// - `create_client` / `update_client` → `{ client: ApiClient }`
// - `create_key`          → `{ key: ApiKeySummary, api_key: string }`（明文仅此一次）
// - `update_key` / `set_key_functions` / `set_key_restaurants` / `revoke_key` → `{ key: ApiKeySummary }`
// 错误码：400（校验失败 / 餐厅不存在 / 函数未登记）/ 401（未登录）/ 403（非管理员）/
// 404（function / client / key 不存在）/ 409（函数名或调用方名重复 / key 已吊销）/ 500（数据库错误）

import { z } from "zod";

const FunctionNameSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be an edge function directory name");
const RestaurantScopeSchema = z.enum(["all", "listed"]);

export const ManageApiKeysInputSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("list") }),
  z.object({ action: z.literal("list_functions") }),
  z.object({
    action: z.literal("create_function"),
    name: FunctionNameSchema,
    description: z.string().nullable().optional(),
    enable: z.boolean().optional(),
  }),
  z.object({
    action: z.literal("update_function"),
    function_id: z.number().int().positive(),
    description: z.string().nullable().optional(),
    enable: z.boolean().optional(),
  }),
  z.object({
    action: z.literal("create_client"),
    name: z.string().trim().min(1),
    description: z.string().nullable().optional(),
    enable: z.boolean().optional(),
    // external_platform.code；不传或 null = 调用方不属于任何第三方平台（公司 / 个人）
    platform: z.string().min(1).nullable().optional(),
  }),
  z.object({
    action: z.literal("update_client"),
    client_id: z.number().int().positive(),
    name: z.string().trim().min(1).optional(),
    description: z.string().nullable().optional(),
    enable: z.boolean().optional(),
    platform: z.string().min(1).nullable().optional(),
  }),
  z.object({
    action: z.literal("create_key"),
    client_id: z.number().int().positive(),
    name: z.string().nullable().optional(),
    restaurant_scope: RestaurantScopeSchema.default("listed"),
    expires_at: z.string().datetime({ offset: true }).nullable().optional(),
    function_names: z.array(FunctionNameSchema).default([]),
    restaurant_ids: z.array(z.number().int().positive()).default([]),
  }),
  z.object({
    action: z.literal("update_key"),
    key_id: z.number().int().positive(),
    name: z.string().nullable().optional(),
    enable: z.boolean().optional(),
    restaurant_scope: RestaurantScopeSchema.optional(),
    expires_at: z.string().datetime({ offset: true }).nullable().optional(),
  }),
  z.object({
    action: z.literal("set_key_functions"),
    key_id: z.number().int().positive(),
    function_names: z.array(FunctionNameSchema),
  }),
  z.object({
    action: z.literal("set_key_restaurants"),
    key_id: z.number().int().positive(),
    restaurant_ids: z.array(z.number().int().positive()),
  }),
  z.object({
    action: z.literal("revoke_key"),
    key_id: z.number().int().positive(),
  }),
]);
export type ManageApiKeysInput = z.infer<typeof ManageApiKeysInputSchema>;

export const ApiFunctionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  enable: z.boolean(),
  created_by: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type ApiFunction = z.infer<typeof ApiFunctionSchema>;

export const ApiClientSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  enable: z.boolean(),
  platform: z.string().nullable(),
  created_by: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type ApiClient = z.infer<typeof ApiClientSchema>;

// 不含 key_hash：哈希不下发到前端
export const ApiKeySummarySchema = z.object({
  id: z.number().int(),
  client_id: z.number().int(),
  name: z.string().nullable(),
  key_prefix: z.string(),
  restaurant_scope: RestaurantScopeSchema,
  enable: z.boolean(),
  expires_at: z.string().nullable(),
  revoked_at: z.string().nullable(),
  last_used_at: z.string().nullable(),
  created_by: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  function_names: z.array(z.string()),
  restaurant_ids: z.array(z.number().int()),
});
export type ApiKeySummary = z.infer<typeof ApiKeySummarySchema>;

export const ApiClientWithKeysSchema = ApiClientSchema.extend({
  keys: z.array(ApiKeySummarySchema),
});
export type ApiClientWithKeys = z.infer<typeof ApiClientWithKeysSchema>;
