// update-user-information — 登录用户修改自己的用户信息（public.user_information）：用户名、头像等
//
// Method: POST /functions/v1/update-user-information
// 调用方: 通用（客户端 / 管理端）
// 认证: 需要登录，只能改自己（auth.uid()）
// Content-Type:
//   - application/json：只改文字字段（username / remove_avatar）
//   - multipart/form-data：要上传头像时用；文件放 `avatar` 字段，其余字段同 JSON（remove_avatar 传 "true"/"false"）
//
// 非显而易见的行为：
// 1. 所有字段都是可选的（PATCH 语义：不传 = 不改），但至少要改一项，否则 400。
// 2. 头像存到 Storage 桶 `user` 的 `{user_id}/avatar/{timestamp}.webp`，统一缩放裁剪为 512×512 WebP；
//    转换失败时保留原图（响应 avatar_format=original）。只接受 jpeg / png / webp，最大 5 MB。
// 3. 换头像 / remove_avatar 时，旧头像如果是本桶自己文件夹里的文件会被删除（best-effort）；
//    账号中心同步来的外部头像 URL 不删，只是不再引用。
// 4. `avatar` 和 `remove_avatar=true` 不能同时传。
//
// 成功响应（200）：`UpdateUserInformationResult`
// 错误码：400（校验失败 / 文件类型或大小不对）/ 401（未登录）/ 404（本地没有该用户信息）/
// 405（非 POST）/ 500（上传或数据库错误）

import { z } from "zod";

export const USERNAME_MAX_LENGTH = 50;
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

// 文字字段；头像文件（multipart 的 avatar）不在 schema 里，由函数单独校验
export const UpdateUserInformationInputSchema = z.object({
  username: z.string().trim().min(1).max(USERNAME_MAX_LENGTH).optional(),
  remove_avatar: z.boolean().optional(),
}).strict();

export type UpdateUserInformationInput = z.infer<typeof UpdateUserInformationInputSchema>;

export interface UpdateUserInformationResult {
  user_id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  /** 本次上传了头像时返回：webp = 已转换；original = 转换失败保留原图 */
  avatar_format?: "webp" | "original";
}
