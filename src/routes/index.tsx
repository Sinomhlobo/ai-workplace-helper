import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Mail, FileText, CalendarCheck, MessageSquare, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkAI — AI Workplace Productivity Assistant" },
      { name: "description", content: "Generate emails, summarize meetings, plan tasks and chat with an AI workplace assistant." },
    ],
  }),
  component: Dashboard,
});

const features = [
  { url: "/email", title: "Smart Email Generator", desc: "Draft polished emails in any tone — formal, friendly, persuasive, or apologetic.", icon: Mail },
  { url: "/notes", title: "Meeting Notes Summarizer", desc: "Turn long notes into summaries, action items, deadlines and decisions.", icon: FileText },
  { url: "/planner", title: "AI Task Planner", desc: "Get a prioritized daily schedule and organize your workload.", icon: CalendarCheck },
  { url: "/chat", title: "AI Chatbot Assistant", desc: "Ask anything — your interactive workplace productivity copilot.", icon: MessageSquare },
];

function Dashboard() {
  return (
    <Layout title="Dashboard">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/30 p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Workplace AI</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Do your best work, faster.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A unified AI workspace for emails, meetings, planning, and instant answers. Designed to feel as calm and focused as the best tools you already use.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {features.map((f) => (
            <Link key={f.url} to={f.url} className="group">
              <Card className="h-full p-6 transition-all hover:border-primary/40 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </Layout>
  );
}
