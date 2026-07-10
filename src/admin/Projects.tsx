import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Film,
  Globe,
  Landmark,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Star,
  X,
} from "lucide-react";
import type { WorkspaceProject } from "@/data/platform";
import { useAdminData } from "@/context/AdminDataContext";
import type { ApiProjectDocuments } from "@/lib/api-client";
import { generateProjectCognition } from "@/lib/api-client";
import {
  PROJECT_OVERVIEW_METRICS_BY_ID,
  type ProjectRiskLevel,
} from "@/data/project-overview-metrics";
import { cn } from "@/lib/utils";

function parseStatusClass(status: string): string {
  if (status === "已解析") return "text-[hsl(145_22%_30%)]";
  if (status === "解析中") return "text-[hsl(18_28%_38%)]";
  return "text-red-600";
}

function DocumentRow({
  filename,
  parseStatus,
  userName,
}: {
  filename: string;
  parseStatus: string;
  userName?: string;
}) {
  if (userName) {
    return (
      <li className="grid grid-cols-[4.25rem_minmax(0,1fr)_3.25rem] items-center gap-x-3 border-b border-border/40 py-2.5 last:border-0 sm:grid-cols-[4.75rem_minmax(0,1fr)_3.5rem] sm:gap-x-4">
        <span className="truncate rounded bg-muted px-1.5 py-0.5 text-center text-[11px] font-medium text-foreground/85">
          {userName}
        </span>
        <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-3.5 w-3.5 shrink-0 text-primary/70" />
          <span className="truncate">{filename}</span>
        </span>
        <span
          className={cn(
            "text-right text-xs leading-none",
            parseStatusClass(parseStatus)
          )}
        >
          {parseStatus}
        </span>
      </li>
    );
  }

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_3.25rem] items-center gap-x-4 border-b border-border/40 py-2.5 last:border-0 sm:gap-x-6">
      <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-3.5 w-3.5 shrink-0 text-primary/70" />
        <span className="truncate">{filename}</span>
      </span>
      <span
        className={cn(
          "text-right text-xs leading-none",
          parseStatusClass(parseStatus)
        )}
      >
        {parseStatus}
      </span>
    </li>
  );
}

function AgentCognitionPanel({ project }: { project: WorkspaceProject }) {
  const { projectCognition, updateProjectCognition } = useAdminData();
  const cached = projectCognition[project.id];
  const [summary, setSummary] = useState<string | null>(cached?.summary ?? null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(
    cached?.generatedAt ?? null,
  );
  const [model, setModel] = useState<string | null>(cached?.model ?? null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const entry = projectCognition[project.id];
    setSummary(entry?.summary ?? null);
    setGeneratedAt(entry?.generatedAt ?? null);
    setModel(entry?.model ?? null);
  }, [project.id, projectCognition]);

  const handleRegenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateProjectCognition(project.id);
      if (!result.summary) {
        setError("模型未返回摘要");
        return;
      }
      setSummary(result.summary);
      setGeneratedAt(result.generatedAt ?? new Date().toISOString());
      setModel(result.model ?? null);
      updateProjectCognition(project.id, {
        summary: result.summary,
        generatedAt: result.generatedAt ?? new Date().toISOString(),
        model: result.model ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-lg border border-border/70 p-4">
      <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <Bot className="h-4 w-4 text-primary" />
        Agent 认知摘要
      </h4>
      {summary ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {summary}
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">
          尚未生成认知摘要。点击下方按钮，将结合项目资料与近期对话由 AI 生成管理视角摘要。
        </p>
      )}
      {(generatedAt || model) && (
        <p className="mt-2 text-[11px] text-muted-foreground/80">
          {generatedAt && `生成于 ${generatedAt.slice(0, 19).replace("T", " ")}`}
          {model ? ` · ${model}` : ""}
        </p>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <button
        type="button"
        disabled={generating}
        onClick={() => void handleRegenerate()}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 disabled:opacity-50"
      >
        <RefreshCw className={cn("h-3 w-3", generating && "animate-spin")} />
        {generating ? "生成中…" : summary ? "重新生成认知" : "生成认知摘要"}
      </button>
    </div>
  );
}

function RelatedDocumentsPanel({ documents }: { documents: ApiProjectDocuments }) {
  const { projectDocuments, conversationDocuments } = documents;

  return (
    <div className="rounded-lg border border-border/70 p-4">
      <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <FileText className="h-4 w-4 text-primary" />
        相关文档
      </h4>

      <div className="space-y-5">
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            项目文档
            <span className="ml-1.5 font-normal text-muted-foreground/70">
              · 资料包上传
            </span>
          </div>
          {projectDocuments.length > 0 ? (
            <ul className="rounded-md border border-border/50 bg-muted/10 px-3">
              {projectDocuments.map((doc) => (
                <DocumentRow
                  key={doc.filename}
                  filename={doc.filename}
                  parseStatus={doc.parseStatus}
                />
              ))}
            </ul>
          ) : (
            <p className="py-2 text-xs text-muted-foreground">暂无</p>
          )}
        </div>

        <div className="border-t border-border/50 pt-5">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            对话文档
            <span className="ml-1.5 font-normal text-muted-foreground/70">
              · 标注上传用户
            </span>
          </div>
          {conversationDocuments.length > 0 ? (
            <ul className="rounded-md border border-border/50 bg-muted/10 px-3">
              {conversationDocuments.map((doc) => (
                <DocumentRow
                  key={`${doc.conversationId}-${doc.filename}`}
                  filename={doc.filename}
                  parseStatus={doc.parseStatus}
                  userName={doc.userName}
                />
              ))}
            </ul>
          ) : (
            <p className="py-2 text-xs text-muted-foreground">暂无</p>
          )}
        </div>
      </div>
    </div>
  );
}

function projectRiskBadgeClass(r: ProjectRiskLevel) {
  switch (r) {
    case "低":
      return "bg-[hsl(var(--sage)/0.12)] text-[hsl(145_22%_30%)] ring-[hsl(var(--sage)/0.35)]";
    case "中":
      return "bg-[hsl(var(--wine-muted)/0.65)] text-[hsl(var(--wine-deep))] ring-[hsl(var(--wine)/0.28)]";
    case "中高":
      return "bg-[hsl(var(--terracotta)/0.12)] text-[hsl(18_28%_32%)] ring-[hsl(var(--terracotta)/0.35)]";
    case "高":
      return "bg-red-50 text-red-800 ring-red-200/80";
    default:
      return "bg-muted text-muted-foreground ring-border";
  }
}

function PhaseBadge({ phase }: { phase: string }) {
  const map: Record<string, string> = {
    "Active（资源筹备中）": "bg-[hsl(var(--wine-muted)/0.65)] text-[hsl(var(--wine-deep))] ring-[hsl(var(--wine)/0.28)]",
    "Completed（已签约）": "bg-[hsl(var(--sage)/0.12)] text-[hsl(145_22%_30%)] ring-[hsl(var(--sage)/0.35)]",
    "Paused（暂停）": "bg-[hsl(var(--terracotta)/0.12)] text-[hsl(18_28%_32%)] ring-[hsl(var(--terracotta)/0.35)]",
    "Cancelled（已取消）": "bg-red-50 text-red-800 ring-red-200/80",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        map[phase] ?? "bg-muted text-muted-foreground ring-border"
      )}
    >
      {phase.replace(/（[^）]+）$/, "")}
    </span>
  );
}

function TypeIcon({ category }: { category: string }) {
  const c = category.toLowerCase();
  if (c.includes("biotech") || c.includes("多肽") || c.includes("医疗"))
    return <Star className="h-3.5 w-3.5 text-[hsl(var(--wine-deep))]" />;
  if (c.includes("trade") || c.includes("贸易"))
    return <Globe className="h-3.5 w-3.5 text-[hsl(var(--terracotta))]" />;
  if (c.includes("ip") || c.includes("影视") || c.includes("演员"))
    return <Film className="h-3.5 w-3.5 text-[hsl(var(--wine-mid))]" />;
  if (c.includes("pet") || c.includes("再生") || c.includes("环保"))
    return <Building2 className="h-3.5 w-3.5 text-[hsl(var(--sage))]" />;
  if (c.includes("地产") || c.includes("酒店"))
    return <Building2 className="h-3.5 w-3.5 text-[hsl(var(--terracotta))]" />;
  if (c.includes("证券") || c.includes("数字"))
    return <Landmark className="h-3.5 w-3.5 text-[hsl(var(--wine))]" />;
  if (c.includes("离岸") || c.includes("法务"))
    return <Shield className="h-3.5 w-3.5 text-[hsl(var(--sage))]" />;
  return <Briefcase className="h-3.5 w-3.5 text-primary" />;
}

export function ProjectsPage() {
  const { projects: allProjects, projectDocuments } = useAdminData();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("全部");
  const [phaseFilter, setPhaseFilter] = useState("全部");
  const [sortCol, setSortCol] = useState<keyof WorkspaceProject>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string | null>(null);

  const categories = useMemo(() => {
    const s = new Set(allProjects.map((p) => p.category));
    return ["全部", ...Array.from(s).sort()];
  }, [allProjects]);

  const phases = [
    "全部",
    "Active（资源筹备中）",
    "Completed（已签约）",
    "Paused（暂停）",
    "Cancelled（已取消）",
  ] as const;

  const filtered = useMemo(() => {
    let r = [...allProjects];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (cat !== "全部") r = r.filter((p) => p.category === cat);
    if (phaseFilter !== "全部") r = r.filter((p) => p.phase === phaseFilter);
    r.sort((a, b) => {
      let va = a[sortCol] as string;
      let vb = b[sortCol] as string;
      va = va.toLowerCase();
      vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return r;
  }, [search, cat, phaseFilter, sortCol, sortDir, allProjects]);

  const toggleSort = (col: keyof WorkspaceProject) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir(col === "name" ? "asc" : "desc");
    }
  };

  const sel = selected ? allProjects.find((p) => p.id === selected) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold text-foreground">
            在管项目
          </h2>
          <span className="rounded-full bg-primary/12 px-2 py-0.5 text-xs font-semibold text-primary">
            {allProjects.length} 项
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            新增项目
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition hover:bg-muted/60"
          >
            <Download className="h-3.5 w-3.5" />
            导出
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition hover:bg-muted/60"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            刷新
          </button>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/35"
              placeholder="搜索项目名称、赛道、摘要或项目 ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
              {categories.map((t) => (
                <option key={t} value={t}>
                  {t === "全部" ? "全部赛道" : t}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none"
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
            >
              {phases.map((t) => (
                <option key={t} value={t}>
                  {t === "全部" ? "全部阶段" : t.replace(/（[^）]+）$/, "")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/80">
                {(
                  [
                    ["name", "项目名称", "min-w-48"],
                    ["category", "赛道", ""],
                    ["phase", "阶段", ""],
                  ] as const
                ).map(([key, label, extra]) => (
                  <th
                    key={key}
                    className={cn(
                      "cursor-pointer select-none px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground hover:text-foreground",
                      extra
                    )}
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
                <th className="whitespace-nowrap px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                  规模
                </th>
                <th className="whitespace-nowrap px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                  净值
                </th>
                <th className="whitespace-nowrap px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                  起投
                </th>
                <th className="whitespace-nowrap px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                  风险程度
                </th>
                <th
                  className={cn(
                    "cursor-pointer select-none px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground hover:text-foreground",
                    "font-mono"
                  )}
                  onClick={() => toggleSort("id")}
                >
                  <span className="inline-flex items-center gap-1">
                    项目 ID
                    {sortCol === "id" &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const m = PROJECT_OVERVIEW_METRICS_BY_ID[r.id];
                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "cursor-pointer border-b border-border/50 transition hover:bg-primary/[0.06]",
                      selected === r.id && "bg-primary/[0.08]"
                    )}
                    onClick={() =>
                      setSelected((s) => (s === r.id ? null : r.id))
                    }
                  >
                    <td className="px-2 py-2.5 font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <TypeIcon category={r.category} />
                        {r.name}
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-muted-foreground">
                      {r.category}
                    </td>
                    <td className="px-2 py-2.5">
                      <PhaseBadge phase={r.phase} />
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 tabular-nums text-muted-foreground">
                      {m?.scaleLabel ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 tabular-nums text-muted-foreground">
                      {m?.netValueLabel ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 tabular-nums text-muted-foreground">
                      {m?.minInvestWanLabel ?? "—"}
                    </td>
                    <td className="px-2 py-2.5">
                      {m ? (
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                            projectRiskBadgeClass(m.riskLevel)
                          )}
                        >
                          {m.riskLevel}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground">
                      {r.id}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    无匹配项目
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {sel && (
        <div className="rounded-xl border border-border/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                <TypeIcon category={sel.category} />
                {sel.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {sel.category} ·{" "}
                <span className="font-mono text-xs">{sel.id}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
              <div className="text-xs text-muted-foreground">内部摘要</div>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {sel.summary}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
              <div className="text-xs text-muted-foreground">访客可见摘要</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {sel.guestSummary}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <AgentCognitionPanel project={sel} />
            <RelatedDocumentsPanel
              documents={
                projectDocuments[sel.id] ?? {
                  projectDocuments: [],
                  conversationDocuments: [],
                }
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
