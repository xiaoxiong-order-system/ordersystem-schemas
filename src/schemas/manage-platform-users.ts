// manage-platform-users — 平台管理员按邮箱把小熊账号同步为本地用户，并管理其平台身份（public.user_role）
//
// Method: POST /functions/v1/manage-platform-users
// 调用方: 管理端（restaurant-server-hub「用户与权限」页）
// 认证: 需要登录且是平台管理员（public.user_role 关联 role.name='admin'），否则 403；所有 action 都要求 admin
//
// 非显而易见的行为：
// 1. 用户 UUID 一律由本函数调小熊账号中心 auth-api `check_email` 取得，`create_user` 不接受前端传入的 UUID，
//    保证本地用户 id 与小熊账号 id 一致（之后用小熊账号登录才能对上同一个本地用户）。
// 2. `create_user` 复用 create-user 函数建 auth.users（触发器同步 public.user / user_information），
//    密码是随机占位值；用户第一次用小熊账号真实登录时会自动同步为真实密码。
// 3. `create_user` / `set_roles` 的 role_ids 是整体替换（PUT 语义），但所有用户都必须有 user 身份：
//    不论是否传入都会自动加上 user，响应里的 role_ids 是实际写入的列表（含 user）。
// 4. 不能移除自己的 admin 身份（防止把最后一个管理员锁在门外），返回 409。
//
// 成功响应（200）：
// - `lookup_email` → `LookupEmailResult`
// - `create_user`  → `{ user_id: string, role_ids: number[] }`
// - `set_roles`    → `{ user_id: string, role_ids: number[] }`
// 错误码：400（校验失败 / 角色不存在 / 邮箱未注册小熊账号）/ 401（未登录）/ 403（非管理员）/
// 404（set_roles 的本地用户不存在）/ 409（本地用户已存在 / 邮箱被其它本地用户占用 / 移除自己的 admin）/
// 502（小熊账号中心不可用）/ 500（数据库错误）

import { z } from "zod";

// 可为空：user 身份由函数自动补上
const RoleIdsSchema = z.array(z.number().int().positive()).max(20);

export const ManagePlatformUsersInputSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("lookup_email"),
    email: z.string().trim().toLowerCase().email(),
  }),
  z.object({
    action: z.literal("create_user"),
    email: z.string().trim().toLowerCase().email(),
    role_ids: RoleIdsSchema,
  }),
  z.object({
    action: z.literal("set_roles"),
    user_id: z.string().uuid(),
    role_ids: RoleIdsSchema,
  }),
]);

export type ManagePlatformUsersInput = z.infer<typeof ManagePlatformUsersInputSchema>;

export interface LookupEmailResult {
  email: string;
  /** 小熊账号中心是否有该邮箱 */
  exists: boolean;
  /** 小熊账号 UUID；exists=false 时为 null */
  user_id: string | null;
  /** 小熊账号的登录方式，如 ["email"] / ["google"] */
  providers: string[];
  /** 本地是否已有该 UUID 的用户 */
  local_exists: boolean;
  /** 本地已有用户时的平台身份 id */
  local_role_ids: number[];
  /** 邮箱已被另一个 UUID 不同的本地用户占用时，那个用户的 id（需要人工处理） */
  conflict_user_id: string | null;
}
