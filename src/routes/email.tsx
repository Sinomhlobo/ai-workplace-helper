import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/CopyButton";
import { Loader2, Sparkles } from "lucide-react";
import { streamCompletion } from "@/lib/ai-client";
import { FEATURE_PROMPTS } from "@/lib/feature-prompts";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator — WorkAI" }] }),
  component: EmailPage,
});

const tones = ["formal", "friendly", "persuasive", "apologetic"];

function EmailPage() {
  const [tone, setTone] = useState("formal");
  const [brief, setBrief] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!brief.trim()) return toast.error("Describe the email you want first");
    setLoading(true);
    setOutput("");
    try {
      await streamCompletion({
        system: FEATURE_PROMPTS.email(tone),
        prompt: brief,
        onToken: (t) => setOutput((p) => p + t),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Smart Email Generator">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Brief</h2>
          <p className="text-sm text-muted-foreground">Tell the AI what the email should say.</p>
          <div className="mt-5 space-y-4">
            <div>
              <Label className="mb-2 block">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">What's the email about?</Label>
              <Textarea
                rows={10}
                placeholder="e.g. Follow up with Sarah about the Q3 roadmap meeting. Confirm the date, share the deck link, and ask for her edits by Friday."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "Generating…" : "Generate email"}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Draft</h2>
            {output && <CopyButton text={output} />}
          </div>
          <p className="text-sm text-muted-foreground">Editable — tweak before sending.</p>
          <Textarea
            rows={18}
            className="mt-5 font-mono text-sm"
            placeholder="Your AI-generated email will appear here…"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
          />
        </Card>
      </div>
    </Layout>
  );
}
