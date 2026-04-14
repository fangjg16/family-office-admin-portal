import { useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Filter,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldAlert,
  ThumbsDown,
  ThumbsUp,
  Wrench,
  X,
} from "lucide-react";
import { ALL_PROJECTS, WORKSPACE_USERS } from "@/data/platform";
import {
  CONVERSATIONS,
  matchConversationView,
  type ConversationRow,
  type RiskLevel,
} from "@/data/conversations-mock";
import { cn } from "@/lib/utils";

type ViewTab = "all" | "pending" | "policy" | "archived";

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map: Record<RiskLevel, string> = {
    正常: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
    提示: "bg-sky-50 text-sky-800 ring-sky-200/80",
    关注: "bg-orange-50 text-orange-900 ring-orange-200/80",
    拦截: "bg-red-50 text-red-800 ring-red-200/80",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
        map[risk]
      )}
    >
      {risk}
    </span>
  );
}

function TierBadge({ t }: { t: ConversationRow["roleTier"] }) {
  return (
    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
      {t}
    </span>
  );
}

function QueueBadge({ q }: { q: ConversationRow["lifecycleQueue"] }) {
  const map: Record<string, string> = {
    对话跟进中: "bg-blue-50 text-blue-800",
    待合规复核: "bg-amber-50 text-amber-900",
    已归档: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", map[q])}>
      {q}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
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
      <div className="font-display text-2xl font-semibold text-foreground">
        {value}
      </div>
      {sub && (
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}

/** 与「账号与权限」工作台用户表一致；无匹配时回退到会话行内的 userName */
function displayNameForConversation(userId: string, fallbackUserName: string) {
  const u = WORKSPACE_USERS.find((x) => x.id === userId);
  return u?.displayName ?? fallbackUserName;
}

function formatRecentListTime(iso: string) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2})/);
  if (!m) return iso;
  return `${m[2]}-${m[3]} ${m[4]}`;
}

function snippetPlain(s: string, max = 44) {
  const t = s.replace(/\*\*/g, "").trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

function conversationNeedsAttention(c: ConversationRow) {
  return (
    c.risk === "关注" ||
    c.risk === "拦截" ||
    c.lifecycleQueue === "待合规复核"
  );
}

const VIEW_TABS: { id: ViewTab; label: string; hint: string }[] = [
  { id: "all", label: "全部", hint: "当前筛选条件下的全部会话" },
  {
    id: "pending",
    label: "待处理队列",
    hint: "待合规复核，或风险为关注/拦截",
  },
  { id: "policy", label: "策略命中", hint: "至少一条策略提示" },
  { id: "archived", label: "已归档", hint: "生命周期已归档" },
];

export function ConversationsPage() {
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("全部");
  const [riskFilter, setRiskFilter] = useState<"全部" | RiskLevel>("全部");
  const [channelFilter, setChannelFilter] = useState<
    "全部" | ConversationRow["channel"]
  >("全部");
  const [viewTab, setViewTab] = useState<ViewTab>("all");
  const [sortCol, setSortCol] = useState<keyof ConversationRow | "policyHits">(
    "lastActiveAt"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<string | null>(null);
  /** 最近对话模块：与下方表格独立选中 */
  const [recentSelectedId, setRecentSelectedId] = useState<string | null>(null);

  const projectNames = useMemo(
    () => ["全部", ...ALL_PROJECTS.map((p) => p.name)],
    []
  );

  const stats = useMemo(() => {
    const today = "2026-04-14";
    const activeToday = CONVERSATIONS.filter((c) =>
      c.lastActiveAt.startsWith(today)
    ).length;
    const msgs = CONVERSATIONS.reduce((s, c) => s + c.messages, 0);
    const hits = CONVERSATIONS.filter((c) => c.policyHits.length > 0).length;
    const exported = CONVERSATIONS.filter((c) => c.exported).length;
    const pending = CONVERSATIONS.filter((c) =>
      matchConversationView(c, "pending")
    ).length;
    return { activeToday, msgs, hits, exported, pending };
  }, []);

  const filtered = useMemo(() => {
    let r = [...CONVERSATIONS];
    const q = search.trim().toLowerCase();
    if (q) {
      r = r.filter(
        (c) =>
          c.userName.toLowerCase().includes(q) ||
          c.projectName.toLowerCase().includes(q) ||
          c.sessionId.toLowerCase().includes(q) ||
          c.lastSnippet.toLowerCase().includes(q) ||
          c.lastIntent.toLowerCase().includes(q)
      );
    }
    if (projectFilter !== "全部") {
      r = r.filter((c) => c.projectName === projectFilter);
    }
    if (riskFilter !== "全部") {
      r = r.filter((c) => c.risk === riskFilter);
    }
    if (channelFilter !== "全部") {
      r = r.filter((c) => c.channel === channelFilter);
    }
    r = r.filter((row) => matchConversationView(row, viewTab));
    r.sort((a, b) => {
      if (sortCol === "policyHits") {
        const va = a.policyHits.length;
        const vb = b.policyHits.length;
        return sortDir === "asc" ? va - vb : vb - va;
      }
      const va = a[sortCol];
      const vb = b[sortCol];
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      if (typeof va === "boolean" && typeof vb === "boolean") {
        const n = va === vb ? 0 : va ? 1 : -1;
        return sortDir === "asc" ? n : -n;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return r;
  }, [
    search,
    projectFilter,
    riskFilter,
    channelFilter,
    viewTab,
    sortCol,
    sortDir,
  ]);

  const toggleSort = (col: keyof ConversationRow | "policyHits") => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir(col === "sessionId" ? "asc" : "desc");
    }
  };

  const sel = selected
    ? CONVERSATIONS.find((c) => c.id === selected)
    : null;

  const recentList = useMemo(
    () =>
      [...CONVERSATIONS]
        .sort((a, b) => b.lastActiveAt.localeCompare(a.lastActiveAt))
        .slice(0, 8),
    []
  );

  const recentSel = recentSelectedId
    ? CONVERSATIONS.find((c) => c.id === recentSelectedId)
    : null;

  return (
    <div className="mx-auto max-w-[min(1680px,100%)] space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            对话监控
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            分栏视图 + 列表字段 + 详情内「时间线 / 工具与知识引用」形成闭环
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition hover:bg-muted/60"
          >
            <Download className="h-3.5 w-3.5" />
            导出会话样本
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition hover:bg-muted/60"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            刷新列表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <SummaryCard
          label="今日活跃会话"
          value={stats.activeToday}
          sub="最后活跃落在今日"
          icon={<MessageSquare className="h-[18px] w-[18px] text-primary" />}
        />
        <SummaryCard
          label="列表内消息条数"
          value={stats.msgs}
          sub="样本合计"
          icon={<Eye className="h-[18px] w-[18px] text-primary" />}
        />
        <SummaryCard
          label="待处理队列"
          value={stats.pending}
          sub="合规或风险需跟进"
          icon={<ShieldAlert className="h-[18px] w-[18px] text-amber-600" />}
        />
        <SummaryCard
          label="策略命中会话"
          value={stats.hits}
          sub="至少一条策略提示"
          icon={<AlertTriangle className="h-[18px] w-[18px] text-orange-600" />}
        />
        <SummaryCard
          label="已导出审计包"
          value={stats.exported}
          sub="合规留痕"
          icon={<CheckCircle2 className="h-[18px] w-[18px] text-emerald-600" />}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm lg:flex-row lg:items-stretch">
        <aside className="flex w-full min-w-0 shrink-0 flex-col lg:max-w-[340px]">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            最近对话
          </h3>
          <div className="flex max-h-[min(400px,52vh)] flex-col overflow-y-auto rounded-lg border border-border/60 bg-muted/20">
            {recentList.map((c) => {
              const name = displayNameForConversation(c.userId, c.userName);
              const active = recentSelectedId === c.id;
              const attention = conversationNeedsAttention(c);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    setRecentSelectedId((id) => (id === c.id ? null : c.id))
                  }
                  className={cn(
                    "flex w-full gap-3 border-b border-border/50 px-3 py-3 text-left transition last:border-b-0",
                    active
                      ? "bg-primary/[0.08]"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground">{name}</div>
                    <div className="truncate text-[11px] text-muted-foreground/85">
                      {c.userOrg}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {snippetPlain(c.lastSnippet)}
                    </p>
                    <div className="mt-1 text-[11px] text-muted-foreground/90">
                      {formatRecentListTime(c.lastActiveAt)}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      {attention ? (
                        <AlertCircle
                          className="h-3.5 w-3.5 text-amber-500"
                          aria-hidden
                        />
                      ) : null}
                      <span className="tabular-nums text-xs text-muted-foreground">
                        {c.messages}条
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex min-h-[min(280px,44vh)] min-w-0 flex-1 flex-col rounded-xl border border-dashed border-border/70 bg-muted/15">
          {!recentSel ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground/35" />
              <p className="text-sm text-muted-foreground">
                选择对话查看详情
              </p>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="shrink-0 border-b border-border/60 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base font-semibold text-foreground">
                      {displayNameForConversation(
                        recentSel.userId,
                        recentSel.userName
                      )}{" "}
                      的对话
                    </h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatRecentListTime(recentSel.lastActiveAt)} ·{" "}
                      {recentSel.projectName} · {recentSel.channel}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground/90">
                      {recentSel.sessionId} · {recentSel.userOrg}
                    </p>
                  </div>
                  {conversationNeedsAttention(recentSel) ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/90 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900">
                      <AlertCircle className="h-3.5 w-3.5" />
                      需关注
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {recentSel.turns.map((turn, i) => (
                  <div key={i}>
                    <div
                      className={cn(
                        "flex",
                        turn.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[92%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                          turn.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "border border-border/80 bg-white text-foreground shadow-sm"
                        )}
                      >
                        <div className="mb-1 text-[10px] opacity-80">
                          {turn.role === "user" ? "用户" : "助手"} ·{" "}
                          {turn.time}
                        </div>
                        {turn.content}
                      </div>
                    </div>
                    {turn.role === "assistant" && (
                      <div className="mt-1.5 flex justify-start pl-1">
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-white px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            正确
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-white px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                          >
                            <ThumbsDown className="h-3 w-3" />
                            有误
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-white px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                          >
                            不全
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            会话分栏
          </div>
          <div className="flex flex-wrap gap-2">
            {VIEW_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                title={t.hint}
                onClick={() => setViewTab(t.id)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold transition",
                  viewTab === t.id
                    ? "border-primary bg-primary/12 text-primary"
                    : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/35"
              placeholder="搜索用户、项目、会话 ID、意图或摘要…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
              <Filter className="h-3.5 w-3.5" />
              筛选
            </span>
            <select
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              {projectNames.map((p) => (
                <option key={p} value={p}>
                  {p === "全部" ? "全部项目" : p}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none"
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(e.target.value as typeof riskFilter)
              }
            >
              <option value="全部">全部风险</option>
              <option value="正常">正常</option>
              <option value="提示">提示</option>
              <option value="关注">关注</option>
              <option value="拦截">拦截</option>
            </select>
            <select
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none"
              value={channelFilter}
              onChange={(e) =>
                setChannelFilter(e.target.value as typeof channelFilter)
              }
            >
              <option value="全部">全部通道</option>
              <option value="项目对话">项目对话</option>
              <option value="内部评测">内部评测</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1280px] text-sm">
            <thead>
              <tr className="border-b border-border/80">
                {(
                  [
                    ["sessionId", "会话"],
                    ["projectName", "项目"],
                    ["userName", "用户"],
                    ["lifecycleQueue", "队列"],
                    ["roleTier", "档位"],
                    ["risk", "风险"],
                    ["policyHits", "策略命中"],
                    ["kbCitations", "知识引用"],
                    ["messages", "消息"],
                    ["tokensEst", "Token(估)"],
                    ["lastActiveAt", "最后活跃"],
                    ["exported", "审计导出"],
                  ] as const
                ).map(([key, label]) => (
                  <th
                    key={key}
                    className="cursor-pointer select-none px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground hover:text-foreground"
                    onClick={() => toggleSort(key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      {sortCol === key &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        ))}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className={cn(
                    "cursor-pointer border-b border-border/50 transition hover:bg-primary/[0.06]",
                    selected === c.id && "bg-primary/[0.08]",
                    c.risk === "拦截" && "bg-red-50/40"
                  )}
                  onClick={() =>
                    setSelected((s) => (s === c.id ? null : c.id))
                  }
                >
                  <td className="px-2 py-2.5 font-mono text-xs text-foreground">
                    {c.sessionId}
                  </td>
                  <td className="max-w-[180px] truncate px-2 py-2.5 text-muted-foreground">
                    {c.projectName}
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="font-medium text-foreground">{c.userName}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.userOrg}
                    </div>
                  </td>
                  <td className="px-2 py-2.5">
                    <QueueBadge q={c.lifecycleQueue} />
                  </td>
                  <td className="px-2 py-2.5">
                    <TierBadge t={c.roleTier} />
                  </td>
                  <td className="px-2 py-2.5">
                    <RiskBadge risk={c.risk} />
                  </td>
                  <td className="max-w-[200px] px-2 py-2.5 text-xs text-muted-foreground">
                    {c.policyHits.length ? (
                      <span className="text-amber-800">
                        {c.policyHits.join("；")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                    {c.kbCitations}
                  </td>
                  <td className="px-2 py-2.5 text-right tabular-nums text-foreground">
                    {c.messages}
                  </td>
                  <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                    {c.tokensEst.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-xs text-muted-foreground">
                    {c.lastActiveAt}
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    {c.exported ? (
                      <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="py-12 text-center text-muted-foreground"
                  >
                    无匹配会话
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {sel && (
        <div className="space-y-4 rounded-xl border border-border/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                <MessageSquare className="h-5 w-5 shrink-0 text-primary" />
                会话详情
              </h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {sel.sessionId} · {sel.channel} ·{" "}
                <QueueBadge q={sel.lifecycleQueue} />
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 闭环：接入 → 对话 → 策略/工具 → 审计 */}
          <ol className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            {[
              { step: "1 接入", ok: true, text: "会话创建 / 鉴权通过" },
              {
                step: "2 对话",
                ok: sel.messages > 0,
                text: `${sel.messages} 条消息`,
              },
              {
                step: "3 策略与工具",
                ok: sel.policyHits.length === 0,
                text:
                  sel.policyHits.length > 0
                    ? `策略 ${sel.policyHits.length} 条`
                    : "未命中",
              },
              {
                step: "4 审计",
                ok: sel.exported,
                text: sel.exported ? "已导出" : "未导出",
              },
            ].map((x) => (
              <li
                key={x.step}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  x.ok
                    ? "border-emerald-200/80 bg-emerald-50/50"
                    : "border-border/80 bg-muted/30"
                )}
              >
                <div className="font-semibold text-foreground">{x.step}</div>
                <div className="mt-0.5 text-muted-foreground">{x.text}</div>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { k: "项目", v: sel.projectName },
              { k: "用户", v: `${sel.userName} (${sel.userId})` },
              { k: "末轮意图", v: sel.lastIntent },
              { k: "风险", v: sel.risk },
            ].map((x) => (
              <div
                key={x.k}
                className="rounded-lg border border-border/70 bg-muted/30 p-3"
              >
                <div className="text-xs text-muted-foreground">{x.k}</div>
                <div className="mt-1 text-sm font-medium leading-snug text-foreground">
                  {x.v}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <MessageSquare className="h-4 w-4 text-primary" />
                会话时间线（节选）
              </h4>
              <div className="max-h-[320px] space-y-3 overflow-y-auto rounded-lg border border-border/70 bg-muted/20 p-4">
                {sel.turns.map((turn, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2",
                      turn.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[95%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
                        turn.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border/80 bg-white text-foreground"
                      )}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2 text-[10px] opacity-80">
                        <span>{turn.role === "user" ? "用户" : "助手"}</span>
                        <span className="font-mono">{turn.time}</span>
                      </div>
                      {turn.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Wrench className="h-4 w-4 text-primary" />
                  工具与检索
                </h4>
                <div className="rounded-lg border border-border/70 bg-muted/30 p-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bot className="h-4 w-4" />
                    工具调用
                  </div>
                  <ul className="mt-2 space-y-1 font-mono text-xs text-foreground">
                    {sel.toolsInvoked.map((t) => (
                      <li key={t}>· {t}</li>
                    ))}
                  </ul>
                  <div className="mt-3 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                    知识库引用片段数：{" "}
                    <span className="font-semibold text-foreground">
                      {sel.kbCitations}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                  策略与合规
                </h4>
                {sel.policyHits.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    本会话未触发策略提示或拦截规则。
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {sel.policyHits.map((h) => (
                      <li
                        key={h}
                        className="flex gap-2 rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-sm text-amber-950"
                      >
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {sel.risk === "拦截" && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">
                    <Ban className="mt-0.5 h-4 w-4 shrink-0" />
                    已按策略终止或拒绝继续生成。
                  </div>
                )}
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  末条摘要（脱敏）
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {sel.lastSnippet}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/92"
                  >
                    <Download className="h-3.5 w-3.5" />
                    导出审计包
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-muted/60"
                  >
                    加入合规复核队列
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
