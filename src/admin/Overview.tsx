import type { ReactNode } from "react";
import {
  Coins,
  Database,
  FolderKanban,
  LayoutDashboard,
  LayoutGrid,
  MessageCircle,
  UserCircle2,
  Users,
} from "lucide-react";
import {
  ALL_PROJECTS,
  TOTAL_PROJECT_COUNT,
  WORKSPACE_USERS,
} from "@/data/platform";
import { KNOWLEDGE_DOCS } from "@/data/knowledge-mock";
import { ActiveUsersLineChart, TokenAreaChart } from "@/admin/charts";
import { buildActiveUserDailyData, buildTokenDailyData } from "@/admin/mockToken";
import { cn } from "@/lib/utils";

const ACTIVE_TREND_DAYS = 14;

/** 底部「用户 / Token」两列图表统一高度，避免左右白卡片不齐 */
const BOTTOM_CHART_HEIGHT = 236;

/** 跨项目待办 / 风控问题等汇总（占位） */
const PENDING_ISSUES_DEMO = 6;

function countByPhase() {
  let active = 0;
  let completed = 0;
  let paused = 0;
  let cancelled = 0;
  for (const p of ALL_PROJECTS) {
    if (p.phase.startsWith("Active")) active += 1;
    else if (p.phase.startsWith("Completed")) completed += 1;
    else if (p.phase.startsWith("Paused")) paused += 1;
    else if (p.phase.startsWith("Cancelled")) cancelled += 1;
  }
  return { active, completed, paused, cancelled };
}

function SectionBlock({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-5", className)}>
      <div className="flex items-center gap-3 border-b border-border/70 pb-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <h2 className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  className,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col rounded-xl border border-border/80 bg-white/90 px-6 pb-4 pt-3 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-1 flex h-9 shrink-0 items-center justify-between gap-2">
        <span className="line-clamp-1 min-w-0 flex-1 pr-1 text-sm font-medium leading-tight text-muted-foreground">
          {label}
        </span>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80">
          {icon}
        </div>
      </div>
      <div className="font-display text-3xl font-semibold tabular-nums leading-none tracking-tight text-foreground md:text-4xl">
        {value}
      </div>
    </div>
  );
}

/** 指标/状态网格面板：标题 + 等宽色块，用于项目区左右对称布局 */
function StatsPanel({
  title,
  icon,
  items,
  columns = 4,
  className,
}: {
  title: string;
  icon: ReactNode;
  items: {
    label: string;
    value: string | number;
    cl: string;
  }[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const gridClass =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : columns === 2
        ? "grid-cols-2"
        : "grid-cols-2 sm:grid-cols-4";

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col rounded-xl border border-border/80 bg-white/90 px-6 pb-4 pt-3 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-1 flex h-9 shrink-0 items-center justify-between gap-2">
        <span className="line-clamp-1 min-w-0 flex-1 pr-1 text-sm font-medium leading-tight text-muted-foreground">
          {title}
        </span>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80">
          {icon}
        </div>
      </div>
      <div className={cn("grid flex-1 gap-2 sm:gap-2.5", gridClass)}>
        {items.map((x) => (
          <div
            key={x.label}
            className={cn(
              "flex min-h-[4.25rem] flex-col justify-center gap-1 rounded-lg border px-2.5 py-2 sm:min-h-[4.5rem] sm:px-3 sm:py-2.5",
              "bg-gradient-to-br",
              x.cl
            )}
          >
            <div className="font-display text-2xl font-semibold tabular-nums leading-none md:text-3xl">
              {x.value}
            </div>
            <div className="text-xs font-medium leading-tight sm:text-sm">
              {x.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border/80 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-sm">
      <div className="mb-2 flex h-9 shrink-0 items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80 text-primary">
          {icon}
        </div>
        <h3 className="font-display text-base font-semibold leading-tight text-foreground">
          {title}
        </h3>
      </div>
      <div
        className="w-full shrink-0 overflow-hidden"
        style={{ height: BOTTOM_CHART_HEIGHT }}
      >
        {children}
      </div>
    </div>
  );
}

export function OverviewPage() {
  const tokenDailyData = buildTokenDailyData(30);
  const activeUserDaily = buildActiveUserDailyData(ACTIVE_TREND_DAYS);
  const todayActiveUsers =
    activeUserDaily[activeUserDaily.length - 1]?.activeUsers ?? 0;
  const todayConversations =
    activeUserDaily[activeUserDaily.length - 1]?.conversations ?? 0;

  const phase = countByPhase();

  const monthTokenM = (
    tokenDailyData.reduce((s, d) => s + d.total, 0) / 1_000_000
  ).toFixed(2);

  const knowledgeDocCount = KNOWLEDGE_DOCS.length;

  const statusItems = [
    {
      label: "筹备中",
      value: phase.active,
      cl: "text-[hsl(var(--wine-deep))] bg-[hsl(var(--wine-muted)/0.65)] border-[hsl(var(--wine)/0.28)]",
    },
    {
      label: "已签约",
      value: phase.completed,
      cl: "text-[hsl(145_22%_30%)] bg-[hsl(var(--sage)/0.12)] border-[hsl(var(--sage)/0.35)]",
    },
    {
      label: "暂停",
      value: phase.paused,
      cl: "text-[hsl(18_28%_32%)] bg-[hsl(var(--terracotta)/0.12)] border-[hsl(var(--terracotta)/0.35)]",
    },
    {
      label: "已取消",
      value: phase.cancelled,
      cl: "text-red-700 bg-red-50 border-red-200/80",
    },
  ];

  const projectMetrics = [
    {
      label: "在管项目",
      value: TOTAL_PROJECT_COUNT,
      cl: "text-[hsl(var(--wine-deep))] bg-[hsl(var(--wine-muted)/0.65)] border-[hsl(var(--wine)/0.28)]",
    },
    {
      label: "知识库文档",
      value: knowledgeDocCount,
      cl: "text-[hsl(145_22%_30%)] bg-[hsl(var(--sage)/0.12)] border-[hsl(var(--sage)/0.35)]",
    },
    {
      label: "待处理问题",
      value: PENDING_ISSUES_DEMO,
      cl: "text-[hsl(18_28%_32%)] bg-[hsl(var(--terracotta)/0.12)] border-[hsl(var(--terracotta)/0.35)]",
    },
  ];

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto pb-2 md:gap-8 md:pb-4">
      {/* 上：项目通栏 */}
      <SectionBlock
        title="项目"
        icon={<FolderKanban className="h-5 w-5" strokeWidth={2} />}
      >
        <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 xl:gap-5">
          <StatsPanel
            title="项目概览"
            icon={<Database className="h-5 w-5 text-primary" strokeWidth={2} />}
            items={projectMetrics}
            columns={3}
          />
          <StatsPanel
            title="项目状态一览"
            icon={<LayoutGrid className="h-5 w-5 text-primary" strokeWidth={2} />}
            items={statusItems}
            columns={4}
          />
        </div>
      </SectionBlock>

      {/* 下：左用户 · 右 Token */}
      <div className="grid min-h-0 w-full min-w-0 grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10 xl:gap-12">
        <SectionBlock
          className="lg:h-full"
          title="用户"
          icon={<Users className="h-5 w-5" strokeWidth={2} />}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
            <SummaryCard
              icon={
                <Users className="h-5 w-5 text-primary" strokeWidth={2} />
              }
              label="工作台账号"
              value={String(WORKSPACE_USERS.length)}
            />
            <SummaryCard
              icon={
                <UserCircle2 className="h-5 w-5 text-primary" strokeWidth={2} />
              }
              label="今日活跃用户"
              value={String(todayActiveUsers)}
            />
            <SummaryCard
              icon={
                <MessageCircle className="h-5 w-5 text-primary" strokeWidth={2} />
              }
              label="今日对话数"
              value={String(todayConversations)}
            />
          </div>
          <ChartCard
            title={`近 ${ACTIVE_TREND_DAYS} 天活跃与对话趋势`}
            icon={<LayoutDashboard className="h-5 w-5" strokeWidth={2} />}
          >
            <ActiveUsersLineChart
              data={activeUserDaily}
              height={BOTTOM_CHART_HEIGHT}
            />
          </ChartCard>
        </SectionBlock>

        <SectionBlock
          className="lg:h-full"
          title="Token"
          icon={<Coins className="h-5 w-5" strokeWidth={2} />}
        >
          <SummaryCard
            icon={<Coins className="h-5 w-5 text-primary" strokeWidth={2} />}
            label="本月 Token"
            value={`${monthTokenM}M`}
          />
          <ChartCard
            title="近 30 天 Token 消耗趋势"
            icon={<LayoutDashboard className="h-5 w-5" strokeWidth={2} />}
          >
            <TokenAreaChart
              data={tokenDailyData}
              height={BOTTOM_CHART_HEIGHT}
              xInterval={6}
            />
          </ChartCard>
        </SectionBlock>
      </div>
    </div>
  );
}
