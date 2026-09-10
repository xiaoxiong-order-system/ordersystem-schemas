import { z } from "zod";

// Shopify 原始 payload 字段远多于此处声明，未声明字段随 data 整体落地存档，
// 因此每层都用 .passthrough() 保留未知字段，不做逐一校验
const ShopifyNoteAttributeSchema = z.object({
  name: z.string(),
  value: z.unknown(),
}).passthrough();

const ShopifyLineItemSchema = z.object({
  sku: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  quantity: z.number().nullable().optional(),
  price: z.union([z.string(), z.number()]).nullable().optional(),
  properties: z.unknown().nullable().optional(),
}).passthrough();

const ShopifyContactSchema = z.object({
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
}).passthrough();

const ShopifyOrderDataSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  financial_status: z.string().nullable().optional(),
  total_price: z.union([z.string(), z.number()]).nullable().optional(),
  currency: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  customer: ShopifyContactSchema.nullable().optional(),
  billing_address: ShopifyContactSchema.nullable().optional(),
  note_attributes: z.array(ShopifyNoteAttributeSchema).nullable().optional(),
  line_items: z.array(ShopifyLineItemSchema).nullable().optional(),
  deliveryType: z.string().nullable().optional(),
  deliveryAddress: z.unknown().nullable().optional(),
}).passthrough();

export const ShopifyOrderWebhookInputSchema = z.object({
  action: z.enum(["order_create", "order_cancelled", "order_updated", "order_paid"]),
  data: ShopifyOrderDataSchema,
});
export type ShopifyOrderWebhookInput = z.infer<typeof ShopifyOrderWebhookInputSchema>;

export const ShopifyOrderWebhookResponseSchema = z.object({
  ok: z.literal(true),
  order_id: z.number().int(),
  restaurant_id: z.number().int().nullable(),
});
export type ShopifyOrderWebhookResponse = z.infer<typeof ShopifyOrderWebhookResponseSchema>;
