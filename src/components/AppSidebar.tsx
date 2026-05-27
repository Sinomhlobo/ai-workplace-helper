import { Link, useRouterState } from "@tanstack/react-router";
import { Mail, FileText, CalendarCheck, MessageSquare, LayoutDashboard, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Notes Summarizer", url: "/notes", icon: FileText },
  { title: "Task Planner", url: "/planner", icon: CalendarCheck },
  { title: "Chatbot", url: "/chat", icon: MessageSquare },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">WorkAI</div>
          <div className="text-xs text-muted-foreground">Productivity Assistant</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Responsible AI</p>
        <p className="mt-1 leading-relaxed">
          AI output may be inaccurate. Always review before sending or acting.
        </p>
      </div>
    </aside>
  );
}
