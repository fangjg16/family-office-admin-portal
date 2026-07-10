import { useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  Clock,
  Network,
  Play,
  Shield,
  Sparkles,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { cn } from "@/lib/utils";

type AgentTab = "skills" | "architecture" | "sandbox";

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "border border-border/80 bg-white text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function jobStatusClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "completed") {
    return "bg-[hsl(var(--sage)/0.14)] text-[hsl(145_22%_32%)]";
  }
  if (s === "running" || s === "pending") {
    return "bg-[hsl(var(--terracotta)/0.14)] text-[hsl(18_28%_38%)]";
  }
  if (s === "failed" || s === "cancelled") {
    return "bg-red-50 text-red-700";
  }
  return "bg-muted/80 text-muted-foreground";
}

export function AgentsPage() {
  const { agentsCatalog } = useAdminData();
  const [tab, setTab] = useState<AgentTab>("skills");
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const { skills, recentJobs, permissionRules } = agentsCatalog;

  const selectedSkill = useMemo(
    () => skills.find((s) => s.id === selectedSkillId) ?? skills[0] ?? null,
    [skills, selectedSkillId],
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Agent 管理
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          运行时技能路由与深度任务监控（只读；规则在线编辑即将推出）
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <TabButton
            active={tab === "skills"}
            onClick={() => setTab("skills")}
            icon={<BookOpen className="h-4 w-4" />}
            label="技能与路由"
          />
          <TabButton
            active={tab === "architecture"}
            onClick={() => setTab("architecture")}
            icon={<Network className="h-4 w-4" />}
            label="运行架构"
          />
          <TabButton
            active={tab === "sandbox"}
            onClick={() => setTab("sandbox")}
            icon={<Play className="h-4 w-4" />}
            label="测试沙盒"
          />
        </div>
      </div>

      {tab === "skills" && (
        <div className="space-y-4">
          <section className="rounded-xl border border-border/80 bg-white/95 shadow-sm backdrop-blur-sm">
            <div className="grid min-h-[480px] lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="border-b border-border/70 p-3 lg:border-b-0 lg:border-r">
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  技能目录
                </h4>
                <ul className="max-h-[420px] space-y-1 overflow-y-auto">
                  {skills.map((skill) => {
                    const active = selectedSkill?.id === skill.id;
                    return (
                      <li key={skill.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedSkillId(skill.id)}
                          className={cn(
                            "flex w-full flex-col gap-0.5 rounded-md px-2.5 py-2 text-left text-xs transition",
                            active
                              ? "bg-primary/12 text-primary"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          )}
                        >
                          <span className="font-semibold text-foreground">
                            {skill.label}
                          </span>
                          <span
                            className={cn(
                              "text-[10px]",
                              skill.route === "快答"
                                ? "text-[hsl(145_22%_32%)]"
                                : "text-[hsl(18_28%_38%)]",
                            )}
                          >
                            {skill.route}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              <div className="p-4">
                {selectedSkill ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {selectedSkill.label}
                      </h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {selectedSkill.id}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          selectedSkill.route === "快答"
                            ? "bg-[hsl(var(--sage)/0.14)] text-[hsl(145_22%_32%)]"
                            : "bg-[hsl(var(--terracotta)/0.14)] text-[hsl(18_28%_38%)]",
                        )}
                      >
                        {selectedSkill.route}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {selectedSkill.summary}
                    </p>
                    <div className="mt-4 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                      <p className="text-xs font-semibold text-foreground">
                        触发关键词（示意）
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {selectedSkill.triggerHint}
                      </p>
                    </div>
                    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      技能定义来自线上 Worker（chat-modes），与 Hermes Railway
                      Skills 联动。本页只读，修改需走代码发布流程。
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">暂无技能数据</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              权限矩阵（只读）
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {permissionRules.map((rule) => (
                <div
                  key={rule.role}
                  className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {rule.label}
                  </p>
                  <ul className="mt-1.5 list-inside list-disc text-xs text-muted-foreground">
                    {rule.capabilities.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              近期深度任务（agent_jobs）
            </h3>
            {recentJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无深度任务记录</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/80 text-left text-xs text-muted-foreground">
                      <th className="py-2 pr-2">技能</th>
                      <th className="py-2 pr-2">项目</th>
                      <th className="py-2 pr-2">用户</th>
                      <th className="py-2 pr-2">状态</th>
                      <th className="py-2 pr-2">KN</th>
                      <th className="py-2">创建时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentJobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="py-2 pr-2 font-medium text-foreground">
                          {job.skillLabel}
                        </td>
                        <td className="py-2 pr-2 text-muted-foreground">
                          {job.projectName}
                        </td>
                        <td className="py-2 pr-2 text-muted-foreground">
                          {job.userName}
                        </td>
                        <td className="py-2 pr-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                              jobStatusClass(job.status),
                            )}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-2 pr-2 text-muted-foreground">
                          {job.hasKnowledgeNetwork ? "是" : "—"}
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">
                          {job.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              会话级详情见「对话监控」；此处聚焦 Hermes 深度任务队列。
            </p>
          </section>
        </div>
      )}

      {tab === "architecture" && (
        <section className="rounded-xl border border-border/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            线上运行架构（真实）
          </h3>
          <div className="space-y-1 text-center text-sm">
            <div className="inline-flex rounded-lg border border-border/70 bg-white px-3 py-1.5 font-medium">
              用户提问（工作台项目对话）
            </div>
            <div className="text-muted-foreground">↓</div>
            <div className="inline-flex rounded-lg border border-[hsl(var(--wine-mid)/0.45)] bg-[hsl(var(--wine-muted)/0.7)] px-4 py-2 font-semibold text-[hsl(var(--wine-deep))]">
              意图识别（SkillIntent）
            </div>
            <div className="text-muted-foreground">↓</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[hsl(var(--sage)/0.35)] bg-[hsl(var(--sage)/0.08)] px-4 py-3">
                <p className="font-semibold text-foreground">标准快答</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  同步 / 流式 · Qwen / Hermes Chat
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  + 项目资料包 RAG（documents / chunks）
                </p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--terracotta)/0.35)] bg-[hsl(var(--terracotta)/0.08)] px-4 py-3">
                <p className="font-semibold text-foreground">Hermes 深度任务</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  agent_jobs · Railway Skills
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  IC 备忘录 / 尽调 / 知识网络 HTML 等
                </p>
              </div>
            </div>
            <div className="text-muted-foreground">↓</div>
            <div className="inline-flex rounded-lg border border-border/70 bg-white px-3 py-1.5 text-xs font-medium">
              权限过滤（workspace-roles）→ 回复用户
            </div>
          </div>
          <p className="mt-5 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            并非 Master + 多 Sub-Agent 架构；线上是「单一助手 + 意图路由 + 可选
            Hermes 后台任务」。知识网络 HTML 存入 R2，元数据在
            project_knowledge_networks。
          </p>
        </section>
      )}

      {tab === "sandbox" && (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-white/60 px-6 py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/80">
            <Play className="h-6 w-6 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            测试沙盒 · 即将推出
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            管理端模拟对话与权限回归测试尚未接入。请先在用户工作台项目页进行真实对话验证；深度任务状态可在本页「技能与路由」查看。
          </p>
        </section>
      )}
    </div>
  );
}
