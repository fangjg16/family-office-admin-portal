import type { ReactNode } from "react";
import {
  BookOpen,
  ClipboardList,
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
  sub,
  trend,
  className,
  /** 与「项目状态一览」色块主数字区垂直对齐：略下移主数字与副文案 */
  leadOffset,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down";
  className?: string;
  leadOffset?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col rounded-xl border border-border/80 bg-white/90 px-6 pb-4 pt-3 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      {/* 固定 h-9 标题行 + 单行标题，与「项目状态一览」及整页指标卡对齐 */}
      <div className="mb-1 flex h-9 shrink-0 items-center justify-between gap-2">
        <span className="line-clamp-1 min-w-0 flex-1 pr-1 text-sm font-medium leading-tight text-muted-foreground">
          {label}
        </span>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80">
          {icon}
        </div>
      </div>
      <div
        className={cn(
          "font-display text-3xl font-semibold tabular-nums leading-none tracking-tight text-foreground md:text-4xl",
          leadOffset && "mt-2.5"
        )}
      >
        {value}
      </div>
      {sub ? (
        <div className="mt-1 shrink-0 text-sm leading-tight text-muted-foreground">
          <span
            className={cn(
              trend === "up" && "text-emerald-600",
              trend === "down" && "text-red-600"
            )}
          >
            {sub}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/** 各阶段在管项目数量（若日后需要饼图，可另增模块，避免与本块重复） */
function ProjectStatusPanel({
  items,
  className,
}: {
  items: {
    label: string;
    n: number;
    cl: string;
  }[];
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
          项目状态一览
        </span>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80">
          <LayoutGrid className="h-5 w-5 text-primary" strokeWidth={2} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
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
              {x.n}
            </div>
            <div className="text-xs font-medium leading-tight sm:text-sm">{x.label}</div>
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
      n: phase.active,
      cl: "text-sky-700 bg-sky-50 border-sky-200/80",
    },
    {
      label: "已签约",
      n: phase.completed,
      cl: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
    },
    {
      label: "暂停",
      n: phase.paused,
      cl: "text-amber-800 bg-amber-50 border-amber-200/80",
    },
    {
      label: "已取消",
      n: phase.cancelled,
      cl: "text-red-700 bg-red-50 border-red-200/80",
    },
  ];

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto pb-2 md:gap-8 md:pb-4">
      {/* 上：项目通栏 */}
      <SectionBlock
        title="项目"
        icon={<FolderKanban className="h-5 w-5" strokeWidth={2} />}
      >
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3 xl:gap-4">
          <SummaryCard
            leadOffset
            className="min-w-0 lg:min-h-0 lg:max-w-[12.5rem] lg:shrink lg:grow-0 lg:basis-[11rem]"
            icon={
              <Database className="h-5 w-5 text-primary" strokeWidth={2} />
            }
            label="在管项目"
            value={String(TOTAL_PROJECT_COUNT)}
            sub={`${phase.active} 个筹备中`}
          />
          <SummaryCard
            leadOffset
            className="min-w-0 lg:min-h-0 lg:max-w-[12.5rem] lg:shrink lg:grow-0 lg:basis-[11rem]"
            icon={
              <BookOpen className="h-5 w-5 text-primary" strokeWidth={2} />
            }
            label="知识库文档"
            value={String(knowledgeDocCount)}
            sub="已入库可检索"
          />
          <SummaryCard
            leadOffset
            className="min-w-0 lg:min-h-0 lg:max-w-[12.5rem] lg:shrink lg:grow-0 lg:basis-[11rem]"
            icon={
              <ClipboardList className="h-5 w-5 text-primary" strokeWidth={2} />
            }
            label="待处理问题"
            value={String(PENDING_ISSUES_DEMO)}
            sub="含跨项目待办"
          />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <ProjectStatusPanel items={statusItems} />
          </div>
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
              sub="含预览访客账号"
            />
            <SummaryCard
              icon={
                <UserCircle2 className="h-5 w-5 text-primary" strokeWidth={2} />
              }
              label="今日活跃用户"
              value={String(todayActiveUsers)}
              sub="当日至少一次会话"
            />
            <SummaryCard
              icon={
                <MessageCircle className="h-5 w-5 text-primary" strokeWidth={2} />
              }
              label="今日对话数"
              value={String(todayConversations)}
              sub="当日会话条数合计"
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
            sub="环比 +12.4%"
            trend="up"
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
