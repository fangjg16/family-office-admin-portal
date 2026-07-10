import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  Coins,
  Download,
  Users,
  Zap,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import type { ApiTokenDailyRow } from "@/lib/api-client";
import { TokenCostBarChart, TokenStackedAreaChart } from "@/admin/charts";
import { cn } from "@/lib/utils";

const ROLE_GROUP_STYLES: Record<string, string> = {
  "管理 / Admin":
    "border-[hsl(var(--wine-deep)/0.28)] bg-[hsl(var(--wine-muted)/0.75)]",
  "Core / Mid": "border-[hsl(var(--wine)/0.28)] bg-[hsl(var(--wine-muted)/0.55)]",
  "Low / 研究": "border-[hsl(var(--terracotta)/0.35)] bg-[hsl(var(--terracotta)/0.12)]",
  "访客 Guest": "border-[hsl(var(--sage)/0.35)] bg-[hsl(var(--sage)/0.12)]",
};

function sliceDailyRows(daily: ApiTokenDailyRow[], days: number): ApiTokenDailyRow[] {
  if (daily.length <= days) return daily;
  return daily.slice(daily.length - days);
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
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
        <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
      )}
    </div>
  );
}

export function TokensPage() {
  const { tokenUsage, users, overview } = useAdminData();
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;

  const tokenDailyData = useMemo(
    () => sliceDailyRows(tokenUsage.daily, days),
    [tokenUsage.daily, days],
  );

  const totalTokens = tokenDailyData.reduce((s, d) => s + d.total, 0);
  const totalCost = tokenDailyData.reduce((s, d) => s + d.cost, 0);
  const avgDaily = Math.round(totalTokens / Math.max(tokenDailyData.length, 1));
  const inputTotal = tokenDailyData.reduce((s, d) => s + d.input, 0);
  const inputPct =
    totalTokens > 0 ? Math.round((inputTotal / totalTokens) * 100) : 0;
  const outputPct = totalTokens > 0 ? 100 - inputPct : 0;

  const isEstimated =
    tokenUsage.estimatedEventCount > 0 && tokenUsage.meteredEventCount === 0;
  const familyAgg = tokenUsage.byRoleGroup;
  const denom = familyAgg.reduce((s, x) => s + x.totalTokens, 0) || 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Token 用量监控
          </h2>
          {isEstimated && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              当前为基于对话字数的估算（尚无精确计量记录）
            </p>
          )}
        </div>
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
                  : "text-muted-foreground hover:text-foreground",
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
          value={
            totalTokens >= 1_000_000
              ? `${(totalTokens / 1_000_000).toFixed(2)}M`
              : totalTokens >= 1000
                ? `${(totalTokens / 1000).toFixed(1)}k`
                : String(totalTokens)
          }
          sub={`近 ${days} 天`}
        />
        <SummaryCard
          icon={<Coins className="h-[18px] w-[18px] text-primary" />}
          label="估算成本"
          value={`$${totalCost.toFixed(2)}`}
          sub="基于单价估算"
        />
        <SummaryCard
          icon={<Activity className="h-[18px] w-[18px] text-primary" />}
          label="日均消耗"
          value={`${(avgDaily / 1000).toFixed(1)}k`}
          sub={`输入约 ${inputPct}% / 输出约 ${outputPct}%`}
        />
        <SummaryCard
          icon={<Users className="h-[18px] w-[18px] text-primary" />}
          label="工作台账号"
          value={String(overview.userCount || users.length)}
          sub="含访客账号"
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
                  最后活跃
                </th>
              </tr>
            </thead>
            <tbody>
              {tokenUsage.byUser.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-2 py-6 text-center text-sm text-muted-foreground"
                  >
                    暂无 Token 记录
                  </td>
                </tr>
              ) : (
                tokenUsage.byUser.map((u) => (
                  <tr
                    key={u.userId}
                    className="border-b border-border/50 transition hover:bg-muted/40"
                  >
                    <td className="px-2 py-2.5 font-medium text-foreground">
                      {u.displayName}
                    </td>
                    <td className="px-2 py-2.5 text-muted-foreground">
                      {u.orgTitle}
                    </td>
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
                    <td className="px-2 py-2.5 text-xs text-muted-foreground">
                      {u.lastActive}
                    </td>
                  </tr>
                ))
              )}
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
                ROLE_GROUP_STYLES[x.label] ??
                  "border-border/80 bg-muted/30",
              )}
            >
              <div className="text-sm font-semibold text-foreground">
                {x.label}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Token: {(x.totalTokens / 1000).toFixed(1)}k</span>
                <span>对话: {x.conversations}</span>
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>成本: ${(x.totalTokens * 0.00003).toFixed(2)}</span>
                <span>占比: {((x.totalTokens / denom) * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
