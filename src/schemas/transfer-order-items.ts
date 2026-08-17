import { z } from "zod";

export const TransferOrderItemsInputSchema = z.object({
  restaurant_id:         z.number().int().positive(),
  source_table_id:       z.number().int().positive(),
  destination_table_id:  z.number().int().positive(),
  order_item_ids:        z.array(z.number().int().positive()).min(1),
}).refine(
  (data) => data.source_table_id !== data.destination_table_id,
  { message: "source_table_id and destination_table_id must differ" },
).refine(
  (data) => new Set(data.order_item_ids).size === data.order_item_ids.length,
  { message: "order_item_ids must not contain duplicates" },
);
export type TransferOrderItemsInput = z.infer<typeof TransferOrderItemsInputSchema>;

export const TransferOrderItemsResponseSchema = z.object({
  new_order_id:        z.number().int(),
  new_order_record_no: z.number().int(),
  moved_item_ids:       z.array(z.number().int()),
});
export type TransferOrderItemsResponse = z.infer<typeof TransferOrderItemsResponseSchema>;
