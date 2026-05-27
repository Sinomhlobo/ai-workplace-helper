import { useState, type ReactNode } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function Layout({ children, title }: { children: ReactNode; title: string }) {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 z-50">
            <AppSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-base font-semibold tracking-tight">{title}</h1>
          </div>
          <Button size="icon" variant="ghost" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>

        <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground md:px-8">
          Powered by AI — outputs may contain inaccuracies. Review and edit before use. WorkAI does not store conversations.
        </footer>
      </div>
    </div>
  );
}
