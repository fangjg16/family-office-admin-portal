import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  History,
  Layers,
  ListTree,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { FileTree } from "@/components/ui/file-tree";
import {
  KNOWLEDGE_DOCS,
  getDocPreview,
  getEstimatedPages,
  getLearnBadgeLabel,
  getVersionHistoryForDoc,
  type DocParseStatus,
} from "@/data/knowledge-mock";
import { buildKnowledgeFileTreeData } from "@/lib/knowledge-file-tree";
import { cn } from "@/lib/utils";

function LearnBadge({ status }: { status: DocParseStatus }) {
  const label = getLearnBadgeLabel(status);
  return (
    <span className="text-xs text-muted-foreground">{label}</span>
  );
}

export function KnowledgePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fileTreeData = useMemo(() => buildKnowledgeFileTreeData(), []);

  const sel = useMemo(
    () => KNOWLEDGE_DOCS.find((d) => d.id === selectedId) ?? null,
    [selectedId]
  );

  const preview = sel ? getDocPreview(sel.id, sel) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* 顶栏：与参考稿一致 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">
          知识库管理
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/60"
          >
            <Plus className="h-4 w-4" />
            新建文件夹
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/92"
          >
            <Upload className="h-4 w-4" />
            上传文档
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* 左：文档目录（随页面滚动；侧栏过高时在内部滚动） */}
        <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-white/90 shadow-sm backdrop-blur-sm lg:sticky lg:top-4 lg:max-h-[calc(100vh-7rem)] lg:w-[340px] lg:self-start">
          <div className="shrink-0 border-b border-border/70 px-4 py-3 text-sm font-semibold text-foreground">
            文档目录
          </div>
          <div className="max-h-[min(70vh,720px)] overflow-y-auto p-3 lg:min-h-0 lg:max-h-none lg:flex-1">
            <FileTree
              data={fileTreeData}
              selectedId={selectedId}
              onFileSelect={setSelectedId}
            />
          </div>
        </aside>

        {/* 右：自上而下文档流，整页滚动；不在此卡片内再套一层滚动 */}
        <main className="flex min-w-0 flex-1 flex-col overflow-visible rounded-xl border border-border/80 bg-white/90 shadow-sm backdrop-blur-sm">
          {!sel ? (
            <div className="p-5">
              <div className="flex min-h-[min(280px,42vh)] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 px-4 py-14 text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  文档预览区域
                </p>
                <FileText className="mt-4 h-10 w-10 text-muted-foreground/35" />
                <p className="mt-4 text-base font-semibold text-foreground">
                  选择文件查看详情
                </p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  请从左侧「文档目录」点击任一份文档
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-border/70 px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted/80">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-base font-semibold text-foreground">
                        {sel.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {getEstimatedPages(sel)} 页 · {sel.sizeMb}MB
                      </p>
                      <div className="mt-2">
                        <LearnBadge status={sel.parseStatus} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      title="下载"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      title="查看历史"
                    >
                      <History className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-destructive/80 transition hover:bg-destructive/10 hover:text-destructive"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    文档预览区域
                  </p>
                  <p className="mt-2 font-medium text-foreground">{sel.title}</p>
                  <p className="mt-3 max-w-md text-xs text-muted-foreground">
                    {preview?.pageRangeLabel} · 接入 PDF/Office
                    查看器后可在此嵌入真实预览；以下为解析节选。
                  </p>
                  {preview && (
                    <pre className="mt-4 max-h-32 max-w-full overflow-auto rounded-lg border border-border/60 bg-white/80 p-3 text-left font-sans text-[11px] leading-relaxed text-muted-foreground">
                      {preview.bodyExcerpt.slice(0, 320)}
                      {preview.bodyExcerpt.length > 320 ? "…" : ""}
                    </pre>
                  )}
                </div>
              </div>

              <div className="border-t border-border/70 px-5 py-4">
                <div className="mb-2 text-sm font-semibold text-foreground">
                  版本历史
                </div>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full min-w-[320px] text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/40">
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                          版本名称
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                          日期
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getVersionHistoryForDoc(sel).map((v, i) => (
                        <tr
                          key={i}
                          className={cn(
                            "border-b border-border/50 last:border-0",
                            v.current && "bg-primary/5"
                          )}
                        >
                          <td className="px-4 py-2.5 font-medium text-foreground">
                            {v.label}
                            {v.current && (
                              <span className="ml-2 text-xs text-primary">
                                （当前）
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {v.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-border/70 px-5 py-3 pb-5">
                <button
                  type="button"
                  onClick={() => setDetailOpen((o) => !o)}
                  className="flex w-full items-center justify-between gap-2 text-left text-sm font-medium text-foreground hover:text-primary"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Layers className="h-4 w-4 shrink-0" />
                    <span className="min-w-0">
                      结构化信息（目录 / 流水线 / 索引片段）
                    </span>
                  </span>
                  {detailOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0" aria-hidden />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
                  )}
                </button>
                {detailOpen && preview && (
                  <div className="mt-3 grid gap-4 border-t border-border/50 pt-3 md:grid-cols-2">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <ListTree className="h-3.5 w-3.5" />
                        目录结构
                      </div>
                      <ul className="rounded-lg border border-border/60 bg-muted/20 p-3 text-xs">
                        {preview.toc.length === 0 ? (
                          <li className="text-muted-foreground">暂无</li>
                        ) : (
                          preview.toc.map((t, idx) => (
                            <li
                              key={idx}
                              className={cn(
                                "py-0.5 text-muted-foreground",
                                t.level === 1 && "font-medium text-foreground",
                                t.level === 2 && "pl-3",
                                t.level === 3 && "pl-6"
                              )}
                            >
                              {t.title}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-2 text-xs font-semibold text-muted-foreground">
                        入库流水线
                      </div>
                      <ol className="space-y-1 text-xs">
                        {preview.pipeline.map((s, i) => (
                          <li
                            key={i}
                            className="flex justify-between gap-2 rounded border border-border/50 bg-white/80 px-2 py-1"
                          >
                            <span>{s.step}</span>
                            <span className="text-muted-foreground">
                              {s.status}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="md:col-span-2">
                      <div className="mb-2 text-xs font-semibold text-muted-foreground">
                        索引片段（Top）
                      </div>
                      <div className="space-y-2">
                        {preview.chunks.map((c) => (
                          <div
                            key={c.chunkId}
                            className="rounded-lg border border-border/60 bg-muted/30 p-2 font-mono text-[11px] text-muted-foreground"
                          >
                            {c.snippet}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          重新解析
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
                        >
                          触发重嵌入
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
