import { z } from "zod";

export const ManagerHelpChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

export const ManagerHelpChatInputSchema = z.object({
  // 完整对话历史，函数本身无状态，由前端每次请求带上全部历史
  messages: z.array(ManagerHelpChatMessageSchema).min(1).max(40),
});

export type ManagerHelpChatMessage = z.infer<typeof ManagerHelpChatMessageSchema>;
export type ManagerHelpChatInput = z.infer<typeof ManagerHelpChatInputSchema>;

// 成功时响应体是 text/event-stream，逐行 "data: <JSON>\n\n"，每行 JSON 是以下三种之一
export const ManagerHelpChatStreamChunkSchema = z.union([
  z.object({ delta: z.string() }),
  z.object({ done: z.literal(true) }),
  z.object({ error: z.string() }),
]);

export type ManagerHelpChatStreamChunk = z.infer<typeof ManagerHelpChatStreamChunkSchema>;
