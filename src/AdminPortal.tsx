import { useState, type ComponentType } from "react";
import {
  BookOpen,
  Bot,
  ChevronLeft,
  Coins,
  Database,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { AgentsPage } from "@/admin/Agents";
import { AccountsPage } from "@/admin/Accounts";
import { ConversationsPage } from "@/admin/Conversations";
import { KnowledgePage } from "@/admin/Knowledge";
import { OverviewPage } from "@/admin/Overview";
import { SettingsPage } from "@/admin/Settings";
import { ProjectsPage } from "@/admin/Projects";
import { TokensPage } from "@/admin/Tokens";
import { cn } from "@/lib/utils";

type PageId =
  | "overview"
  | "accounts"
  | "projects"
  | "tokens"
  | "agents"
  | "knowledge"
  | "conversations"
  | "settings";

const navItems: {
  id: PageId;
  label: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
}[] = [
  { id: "overview", label: "概览", icon: LayoutDashboard },
  { id: "accounts", label: "账号与权限", icon: Users },
  { id: "knowledge", label: "知识库管理", icon: BookOpen },
  { id: "agents", label: "Agent 管理", icon: Bot },
  { id: "projects", label: "在管项目", icon: Database },
  { id: "conversations", label: "对话监控", icon: MessageSquare },
  { id: "tokens", label: "Token 用量", icon: Coins },
  { id: "settings", label: "系统设置", icon: Settings },
];

const navGroups: {
  label: string;
  ids: PageId[];
}[] = [
  { label: "概览", ids: ["overview"] },
  { label: "管理", ids: ["accounts", "knowledge", "agents", "projects"] },
  { label: "监控", ids: ["conversations", "tokens"] },
  { label: "配置", ids: ["settings"] },
];

export default function AdminPortal() {
  const [page, setPage] = useState<PageId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (page) {
      case "overview":
        return <OverviewPage />;
      case "accounts":
        return <AccountsPage />;
      case "projects":
        return <ProjectsPage />;
      case "tokens":
        return <TokensPage />;
      case "agents":
        return <AgentsPage />;
      case "knowledge":
        return <KnowledgePage />;
      case "conversations":
        return <ConversationsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-foreground">
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-border/70 bg-white/90 backdrop-blur-xl transition-[width] duration-200",
          sidebarOpen ? "w-56" : "w-[52px]"
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border/70 px-3">
          {sidebarOpen ? (
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold tracking-tight text-foreground">
                合域
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                Admin
              </div>
            </div>
          ) : (
            <div className="mx-auto font-display text-xs font-bold text-primary">
              合
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={sidebarOpen ? "收起侧栏" : "展开侧栏"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-3">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-0.5">
              {sidebarOpen && (
                <div className="px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                  {group.label}
                </div>
              )}
              {group.ids.map((id) => {
                const item = navItems.find((n) => n.id === id);
                if (!item) return null;
                const Icon = item.icon;
                const active = page === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPage(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-full px-2.5 py-2 text-left text-sm font-semibold transition-all",
                      active
                        ? "bg-primary/12 text-primary shadow-inner shadow-primary/5"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                      !sidebarOpen && "justify-center px-0"
                    )}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className="shrink-0 opacity-90"
                    />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="border-t border-border/70 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white shadow-sm">
                A
              </div>
              <div className="min-w-0 text-xs">
                <div className="truncate font-semibold text-foreground">
                  超级管理员
                </div>
                <div className="truncate text-muted-foreground">合域后台</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-gradient-to-b from-background via-sky-50/[0.35] to-background">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/75 px-6 backdrop-blur-xl">
          <h1 className="font-display text-base font-semibold tracking-tight text-foreground">
            {navItems.find((n) => n.id === page)?.label ?? "概览"}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="text-xs">2026-04-14</span>
            <span className="inline-flex items-center gap-1.5 text-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              系统正常
            </span>
          </div>
        </header>
        <div
          className={cn(
            "mx-auto flex w-full min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable]",
            page === "overview"
              ? "max-w-[min(100%,1920px)] py-6 pb-8 pt-6 md:py-8 md:pb-10 lg:py-8 lg:pb-10 pl-5 md:pl-10 lg:pl-14 pr-10 md:pr-16 lg:pr-20 xl:pr-24"
              : "max-w-screen-xl py-6 pl-6 pr-10 md:pl-8 md:pr-14 lg:pr-16 xl:pr-20"
          )}
        >
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
