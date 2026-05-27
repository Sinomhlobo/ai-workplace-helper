import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/CopyButton";
import { Loader2, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamCompletion } from "@/lib/ai-client";
import { FEATURE_PROMPTS } from "@/lib/feature-prompts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — WorkAI" }] }),
  component: ChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; content: string };

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setLoading(true);
    try {
      // Build a single prompt that includes recent context (simple approach)
      const context = [...messages, userMsg]
        .slice(-10)
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n\n");
      await streamCompletion({
        system: FEATURE_PROMPTS.chat(),
        prompt: context,
        onToken: (t) =>
          setMessages((curr) =>
            curr.map((m) => (m.id === assistantId ? { ...m, content: m.content + t } : m)),
          ),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
      setMessages((curr) => curr.filter((m) => m.id !== assistantId));
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <Layout title="AI Chatbot Assistant">
      <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col">
        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto p-6">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">How can I help you work today?</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Ask anything — drafting messages, brainstorming, summarizing, planning, or quick answers.
                </p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    {m.content}
                  </div>
                ) : (
                  <div className="group max-w-[90%] space-y-2">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : (
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                        </span>
                      )}
                    </div>
                    {m.content && (
                      <div className="opacity-0 transition-opacity group-hover:opacity-100">
                        <CopyButton text={m.content} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                rows={1}
                placeholder="Message WorkAI… (Enter to send, Shift+Enter for newline)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                className="max-h-40 min-h-[44px] resize-none"
              />
              <Button onClick={send} disabled={loading || !input.trim()} size="icon" className="h-11 w-11 shrink-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
