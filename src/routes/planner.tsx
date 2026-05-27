import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/CopyButton";
import { Loader2, CalendarCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamCompletion } from "@/lib/ai-client";
import { FEATURE_PROMPTS } from "@/lib/feature-prompts";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "AI Task Planner — WorkAI" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function plan() {
    if (!tasks.trim()) return toast.error("Add some tasks first");
    setLoading(true);
    setOutput("");
    setEditing(false);
    try {
      await streamCompletion({
        system: FEATURE_PROMPTS.planner(),
        prompt: tasks,
        onToken: (t) => setOutput((p) => p + t),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="AI Task Planner">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Your tasks</h2>
          <p className="text-sm text-muted-foreground">List today's tasks. Add context like deadlines or hours if you'd like.</p>
          <div className="mt-5 space-y-4">
            <Textarea
              rows={16}
              placeholder={"- Finish Q3 report\n- Review 5 PRs\n- 1:1 with Alex at 2pm\n- Prep board deck (due tomorrow)\n- Inbox triage"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
            <Button onClick={plan} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarCheck className="mr-2 h-4 w-4" />}
              {loading ? "Planning…" : "Build my day"}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Plan</h2>
            <div className="flex items-center gap-2">
              {output && (
                <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>
                  {editing ? "Preview" : "Edit"}
                </Button>
              )}
              {output && <CopyButton text={output} />}
            </div>
          </div>
          <div className="mt-5">
            {!output && !loading && <p className="text-sm italic text-muted-foreground">Your prioritized schedule will appear here…</p>}
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
