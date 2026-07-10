import { useMemo, useState } from "react";
import { FileText, Globe, Info } from "lucide-react";
import { FileTree } from "@/components/ui/file-tree";
import { useAdminData } from "@/context/AdminDataContext";
import { buildKnowledgeFileTreeFromCatalog } from "@/lib/knowledge-file-tree";
import { cn } from "@/lib/utils";

function ParseBadge({
  status,
}: {
  status: "已解析" | "解析中" | "待嵌入";
}) {
  const cl =
    status === "已解析"
      ? "text-[hsl(145_22%_30%)]"
      : status === "待嵌入"
        ? "text-[hsl(18_28%_38%)]"
        : "text-muted-foreground";
  return <span className={cn("text-xs font-medium", cl)}>{status}</span>;
}

export function KnowledgePage() {
  const { projects, knowledgeCatalog } = useAdminData();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { documents, knowledgeNetworks, summary } = knowledgeCatalog;

  const fileTreeData = useMemo(
    () => buildKnowledgeFileTreeFromCatalog(documents, projects),
    [documents, projects],
  );

  const sel = useMemo(
    () => documents.find((d) => d.id === selectedId) ?? null,
    [documents, selectedId],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            知识库管理
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            全平台 RAG 语料与项目知识网络（按项目分组，只读）
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "文档总数", value: summary.documentCount },
          { label: "已向量化", value: summary.parsedCount },
          { label: "待嵌入", value: summary.pendingEmbedCount },
          { label: "已发布 KN", value: summary.knowledgeNetworkCount },
        ].map((x) => (
          <div
            key={x.label}
            className="rounded-xl border border-border/80 bg-white/90 px-4 py-3 shadow-sm"
          >
            <div className="text-xs text-muted-foreground">{x.label}</div>
            <div className="font-display text-2xl font-semibold tabular-nums text-foreground">
              {x.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          嵌入模型 {summary.embedModel} · {summary.embedDimension} 维。上传文档请在工作台对应项目页操作；本页为运维只读视图。
        </span>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
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

        <main className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="rounded-xl border border-border/80 bg-white/90 shadow-sm backdrop-blur-sm">
            {!sel ? (
              <div className="p-5">
                <div className="flex min-h-[min(220px,36vh)] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/35" />
                  <p className="mt-4 text-base font-semibold text-foreground">
                    选择文件查看详情
                  </p>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    从左侧按项目展开，点击资料包或对话附件中的文件
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex gap-3 border-b border-border/60 pb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted/80">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-base font-semibold text-foreground">
                      {sel.filename}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {sel.projectName} · {sel.folderLabel}
                    </p>
                    <div className="mt-2">
                      <ParseBadge status={sel.parseStatus} />
                    </div>
                  </div>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  {[
                    ["项目", sel.projectName],
                    ["范围", sel.scope === "package" ? "资料包" : "对话附件"],
                    ["上传时间", sel.uploadedAt],
                    ["上传人", sel.uploadedByName ?? sel.uploadedBy ?? "—"],
                    ["分块数", String(sel.chunkCount)],
                    ["已向量化", String(sel.embeddedCount)],
                    ["文档 ID", sel.id],
                    ...(sel.conversationId
                      ? [["会话 ID", sel.conversationId] as const]
                      : []),
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-muted-foreground">{k}</dt>
                      <dd className="mt-0.5 break-all font-medium text-foreground">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-4 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                  文档预览与下载请在工作台项目页操作；此处展示向量入库状态。
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/80 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-sm">
            <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              项目知识网络（HTML）
            </h3>
            {knowledgeNetworks.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无已发布的知识网络</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/80 text-left text-xs text-muted-foreground">
                      <th className="py-2 pr-3">项目</th>
                      <th className="py-2 pr-3">版本</th>
                      <th className="py-2 pr-3">更新人</th>
                      <th className="py-2 pr-3">更新时间</th>
                      <th className="py-2">最近任务</th>
                    </tr>
                  </thead>
                  <tbody>
                    {knowledgeNetworks.map((kn) => (
                      <tr
                        key={kn.projectId}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="py-2.5 pr-3 font-medium text-foreground">
                          {kn.projectName}
                        </td>
                        <td className="py-2.5 pr-3 tabular-nums text-muted-foreground">
                          v{kn.versionLabel ?? kn.version}
                        </td>
                        <td className="py-2.5 pr-3 text-muted-foreground">
                          {kn.updatedByName}
                        </td>
                        <td className="py-2.5 pr-3 text-muted-foreground">
                          {kn.updatedAt}
                        </td>
                        <td className="py-2.5 font-mono text-xs text-muted-foreground">
                          {kn.lastJobId?.slice(0, 8) ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
