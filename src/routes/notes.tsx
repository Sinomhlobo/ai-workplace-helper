import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/CopyButton";
import { Loader2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamCompletion } from "@/lib/ai-client";
import { FEATURE_PROMPTS } from "@/lib/feature-prompts";
import { toast } from "sonner";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — WorkAI" }] }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function summarize() {
    if (!notes.trim()) return toast.error("Paste your meeting notes first");
    setLoading(true);
    setOutput("");
    setEditing(false);
    try {
      await streamCompletion({
        system: FEATURE_PROMPTS.notes(),
        prompt: notes,
        onToken: (t) => setOutput((p) => p + t),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Meeting Notes Summarizer">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Raw notes</h2>
          <p className="text-sm text-muted-foreground">Paste meeting notes or a transcript.</p>
          <div className="mt-5 space-y-4">
            <Label className="sr-only">Notes</Label>
            <Textarea
              rows={16}
              placeholder="Paste your meeting notes here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button onClick={summarize} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              {loading ? "Summarizing…" : "Summarize"}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="flex items-center gap-2">
              {output && (
                <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>
                  {editing ? "Preview" : "Edit"}
                </Button>
              )}
              {output && <CopyButton text={output} />}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Summary, action items, deadlines & decisions.</p>
          <div className="mt-5">
            {!output && !loading && (
              <p className="text-sm text-muted-foreground italic">Your summary will appear here…</p>
            )}
            {loading && !output && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            )}
            {output && editing && (
              <Textarea rows={18} value={output} onChange={(e) => setOutput(e.target.value)} className="font-mono text-sm" />
            )}
            {output && !editing && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
