// Client helper: stream a one-shot AI completion from /api/chat
export async function streamCompletion({
  system,
  prompt,
  onToken,
  signal,
}: {
  system: string;
  prompt: string;
  onToken: (chunk: string) => void;
  signal?: AbortSignal;
}): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      system,
      messages: [
        {
          id: crypto.randomUUID(),
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
    throw new Error(txt || `Request failed (${res.status})`);
  }
  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("0:")) continue;
      const data = trimmed.slice(2).trim();
      try {
        const text = JSON.parse(data);
        if (typeof text === "string") {
          onToken(text);
        }
      } catch {
        // ignore non-JSON keep-alives
      }
    }
  }
}
