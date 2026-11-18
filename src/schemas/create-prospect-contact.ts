import { z } from "zod";

// create-prospect-contact — 写入意向客户联系信息（小熊官网联系表单）并邮件通知收件人
//
// Method: POST /functions/v1/create-prospect-contact
// 调用方: 其他（小熊官网 xiaoxiong-saas-web 的 Cloudflare Worker，服务端转发）
// 认证: API key（请求头 api-key，须授权本函数）或平台 admin 登录态（_shared/apiKeyOrAdmin.ts）
//
// 所有文本字段先 trim，空字符串按"没填"处理；email / phone / wechat 至少填一个。
// 长度上限与表 prospect_contact 的约束一致。

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().nullable()
    .transform((v) => (v ? v : null));

export const CreateProspectContactInputSchema = z.object({
  name: optionalText(80),
  email: z.string().trim().max(254).optional().nullable()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || z.string().email().safeParse(v).success, "Invalid email"),
  phone: optionalText(40),
  wechat: optionalText(60),
  restaurant_name: optionalText(120),
  // 官网表单选项代码：workflow / ordering / delivery / other；其它值原样保存
  topic: optionalText(40),
  message: optionalText(2000),
  // 从官网服务页进入时附带的所选服务摘要
  service_summary: optionalText(1400),
  // 页面语言：zh / pt-PT / en
  locale: optionalText(10),
  // 来源，不传默认 xiaoxiong-saas-web
  source: z.string().trim().regex(/^[a-z0-9][a-z0-9._:-]{0,59}$/, "Invalid source").optional(),
}).refine((v) => v.email !== null || v.phone !== null || v.wechat !== null, {
  message: "At least one of email, phone or wechat is required",
  path: ["email"],
});

export type CreateProspectContactInput = z.infer<typeof CreateProspectContactInputSchema>;

export const CreateProspectContactResponseSchema = z.object({
  id: z.number().int(),
  // 通知邮件结果：sent 已发送 / failed 发送失败（留言已保存）/ no_recipient 没有启用的收件人
  email_status: z.enum(["sent", "failed", "no_recipient"]),
});

export type CreateProspectContactResponse = z.infer<typeof CreateProspectContactResponseSchema>;
