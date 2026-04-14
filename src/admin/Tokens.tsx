import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  Coins,
  Download,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { WORKSPACE_USERS } from "@/data/platform";
import { TokenCostBarChart, TokenStackedAreaChart } from "@/admin/charts";
import { buildTokenDailyData } from "@/admin/mockToken";
import { cn } from "@/lib/utils";

const userTokenDemo = [
  {
    id: "candice-guo",
    user: "CandiceGuo",
    org: "合域 · Admin",
    role: "Admin",
    totalTokens: 382400,
    conversations: 145,
    avgPerConv: 2637,
    lastActive: "2026-04-14",
    trend: "up" as const,
  },
  {
    id: "jimmy-huang",
    user: "JimmyHuang",
    org: "家族办公室 · Core",
    role: "Core",
    totalTokens: 298700,
    conversations: 112,
    avgPerConv: 2667,
    lastActive: "2026-04-14",
    trend: "up" as const,
  },
  {
    id: "jessica-hu",
    user: "JessicaHu",
    org: "投资顾问 · Mid",
    role: "Mid",
    totalTokens: 245100,
    conversations: 98,
    avgPerConv: 2501,
    lastActive: "2026-04-13",
    trend: "down" as const,
  },
  {
    id: "jensen-fang",
    user: "JensenFang",
    org: "研究部 · Low",
    role: "Low",
    totalTokens: 201300,
    conversations: 87,
    avgPerConv: 2314,
    lastActive: "2026-04-14",
    trend: "up" as const,
  },
  {
    id: "janice-hi",
    user: "JaniceHi",
    org: "访客 · Guest",
    role: "Guest",
    totalTokens: 17800,
    conversations: 12,
    avgPerConv: 1483,
    lastActive: "2026-04-12",
    trend: "down" as const,
  },
];

function SummaryCard({
  icon,
  label,
  value,
  sub,
  trend,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-white/90 px-6 pb-4 pt-3 shadow-sm backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="min-w-0 flex-1 text-sm leading-snug text-muted-foreground">
          {label}
        </span>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80">
          {icon}
        </div>
      </div>
      <div className="font-display text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      {sub && (
        <div className="mt-1 flex items-center gap-1 text-xs">
          {trend === "up" && (
            <TrendingUp className="h-3 w-3 text-emerald-600" />
          )}
          {trend === "down" && (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span
            className={cn(
              trend === "up" && "text-emerald-700",
              trend === "down" && "text-red-600",
              !trend && "text-muted-foreground"
            )}
          >
            {sub}
          </span>
        </div>
      )}
    </div>
  );
}

export function TokensPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;

  const tokenDailyData = useMemo(() => buildTokenDailyData(days), [days]);

  const totalTokens = tokenDailyData.reduce((s, d) => s + d.total, 0);
  const totalCost = tokenDailyData.reduce((s, d) => s + d.cost, 0);
  const avgDaily = Math.round(totalTokens / Math.max(days, 1));
  const prevPeriodTokens = totalTokens * 0.89;

  const familyAgg = [
    {
      label: "管理 / Admin",
      t: 382400 + 12000,
      c: 160,
      ring: "border-indigo-200/90 bg-indigo-50/80",
    },
    {
      label: "Core / Mid",
      t: 298700 + 245100,
      c: 210,
      ring: "border-sky-200/90 bg-sky-50/80",
    },
    {
      label: "Low / 研究",
      t: 201300,
      c: 87,
      ring: "border-amber-200/90 bg-amber-50/80",
    },
    {
      label: "访客 Guest",
      t: 17800,
      c: 12,
      ring: "border-emerald-200/90 bg-emerald-50/80",
    },
  ];

  const denom = familyAgg.reduce((s, x) => s + x.t, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Token 用量监控
        </h2>
        <div className="flex gap-1 rounded-lg bg-muted/80 p-0.5">
          {(
            [
              ["7d", "7天"],
              ["30d", "30天"],
              ["90d", "90天"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setPeriod(k)}
              className={cn(
                "rounded-md px-3 py-1 text-xs transition",
                period === k
                  ? "bg-white font-medium text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          icon={<Zap className="h-[18px] w-[18px] text-primary" />}
          label="总 Token 消耗"
          value={`${(totalTokens / 1_000_000).toFixed(2)}M`}
          sub={`环比 +${((totalTokens / prevPeriodTokens - 1) * 100).toFixed(1)}%`}
          trend="up"
        />
        <SummaryCard
          icon={<Coins className="h-[18px] w-[18px] text-primary" />}
          label="估算成本"
          value={`$${totalCost.toFixed(0)}`}
          sub="基于单价估算"
        />
        <SummaryCard
          icon={<Activity className="h-[18px] w-[18px] text-primary" />}
          label="日均消耗"
          value={`${(avgDaily / 1000).toFixed(1)}k`}
          sub="输入约 60% / 输出约 40%"
        />
        <SummaryCard
          icon={<Users className="h-[18px] w-[18px] text-primary" />}
          label="工作台账号"
          value={String(WORKSPACE_USERS.length)}
          sub="含访客账号"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/80 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-sm lg:col-span-2">
          <h3 className="font-display text-base font-semibold text-foreground">
            每日 Token 消耗
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">
            输入与输出堆叠展示
          </p>
          <TokenStackedAreaChart data={tokenDailyData} />
        </div>
        <div className="rounded-xl border border-border/80 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-sm">
          <h3 className="font-display text-base font-semibold text-foreground">
            每日估算成本
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">美元计价</p>
          <TokenCostBarChart data={tokenDailyData} />
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-sm">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              账号 Token 明细
            </h3>
            <p className="text-xs text-muted-foreground">
              与合域工作台账号一一对应
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition hover:bg-muted/60"
          >
            <Download className="h-3.5 w-3.5" />
            导出
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/80">
                <th className="px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                  用户
                </th>
                <th className="px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                  组织
                </th>
                <th className="px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                  档位
                </th>
                <th className="px-2 py-2.5 text-right text-xs font-semibold text-muted-foreground">
                  总 Token
                </th>
                <th className="px-2 py-2.5 text-right text-xs font-semibold text-muted-foreground">
                  对话数
                </th>
                <th className="px-2 py-2.5 text-right text-xs font-semibold text-muted-foreground">
                  平均/对话
                </th>
                <th className="px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                  趋势
                </th>
                <th className="px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                  最后活跃
                </th>
              </tr>
            </thead>
            <tbody>
              {userTokenDemo.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-border/50 transition hover:bg-muted/40"
                >
                  <td className="px-2 py-2.5 font-medium text-foreground">
                    {u.user}
                  </td>
                  <td className="px-2 py-2.5 text-muted-foreground">{u.org}</td>
                  <td className="px-2 py-2.5">
                    <span className="rounded-full bg-muted/80 px-2 py-0.5 text-xs text-foreground">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-right font-medium text-foreground">
                    {u.totalTokens.toLocaleString()}
                  </td>
                  <td className="px-2 py-2.5 text-right text-muted-foreground">
                    {u.conversations}
                  </td>
                  <td className="px-2 py-2.5 text-right text-muted-foreground">
                    {u.avgPerConv.toLocaleString()}
                  </td>
                  <td className="px-2 py-2.5">
                    {u.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </td>
                  <td className="px-2 py-2.5 text-xs text-muted-foreground">
                    {u.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-sm">
        <h3 className="mb-3 font-display text-base font-semibold text-foreground">
          组织维度汇总
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {familyAgg.map((x) => (
            <div
              key={x.label}
              className={cn(
                "rounded-lg border p-3",
                "bg-gradient-to-br",
                x.ring
              )}
            >
              <div className="text-sm font-semibold text-foreground">
                {x.label}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Token: {(x.t / 1000).toFixed(1)}k</span>
                <span>对话: {x.c}</span>
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>成本: ${(x.t * 0.00003).toFixed(2)}</span>
                <span>占比: {((x.t / denom) * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
