import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type Body = { messages?: UIMessage[]; system?: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, system } = (await request.json()) as Body;
        if (!Array.isArray(messages)) {
          return new Response("Messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway("google/gemini-3-flash-preview"),
            system:
              system ??
              "You are a helpful AI workplace productivity assistant. Be concise, practical, and professional. Format responses with markdown.",
            messages: await convertToModelMessages(messages),
          });
          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (err) {
          const message = err instanceof Error ? err.message : "AI request failed";
          const status = /429/.test(message) ? 429 : /402/.test(message) ? 402 : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});
