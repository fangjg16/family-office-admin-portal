import { useMemo, useState, type ReactNode } from "react";
import {
  Bot,
  ChevronDown,
  ChevronRight,
  Folder,
  History,
  Network,
  Pencil,
  Play,
  Save,
  Send,
  Undo2,
  Zap,
} from "lucide-react";
import { ROLE_LABEL, type WorkspaceRole } from "@/data/platform";
import { buildAgentKnowledgeThemes } from "@/data/agent-knowledge-tree";
import { cn } from "@/lib/utils";

const AGENT_KNOWLEDGE_THEMES = buildAgentKnowledgeThemes();

type AgentTab = "rules" | "structure" | "sandbox";

/** 与合域工作台、账号权限模块一致；勿直接复述内部分级话术给用户 */
const DEFAULT_SYSTEM_PROMPT = `你是「合域」家族办公室工作台中的项目对话 Agent。你在已授权用户的项目命名空间内工作，结合知识库检索与在管项目公开摘要作答，并保持可审计、可追责。

## 身份与语气
- 服务对象为家族成员、内部顾问与运营账号；表达专业、克制，避免夸张承诺。
- 无知识库或项目摘要支撑的具体数字、主体实名、监管结论，须标明不确定性或拒绝展开，禁止臆造。

## 权限与信息粒度（对齐工作台角色）
产品内使用 Admin / Core / Mid / Low / Guest 五档，与「账号与权限」中的角色定义一致；不要在回答中主动说明「你是哪一级」或教用户试探权限边界。
- Admin：平台与项目配置、审计类说明可在合规范围内响应。
- Core：本家族核心数据与授权项目内的维护型信息；跨家族数据默认不可见。
- Mid：脱敏与简化视图；可讨论环节、风险结构与方向性结论，不展开精确金额区间、实名主体映射与底层资产明细。
- Low：以环节是否覆盖、定性风险与升级路径为主；具体数值与身份对应需通过正式流程。
- Guest：仅对应访客可见的总览粒度，不进入项目对话细节。

## 应答边界
- 超权限请求：礼貌说明当前会话可见范围，并建议联系管理员或项目对接人走正式申请。
- 引用材料时可内部对齐知识库文档编号；对外答复以业务可接受与合规为准。`;

const SANDBOX_ROLES: WorkspaceRole[] = [
  "admin",
  "core",
  "mid",
  "low",
  "guest",
];

function sandboxRoleShort(role: WorkspaceRole): string {
  switch (role) {
    case "admin":
      return "Admin";
    case "core":
      return "Core";
    case "mid":
      return "Mid";
    case "low":
      return "Low";
    case "guest":
      return "Guest";
    default:
      return role;
  }
}

export function AgentsPage() {
  const [tab, setTab] = useState<AgentTab>("rules");
  const [prompt, setPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [expandedThemes, setExpandedThemes] = useState<Record<string, boolean>>(
    () =>
      AGENT_KNOWLEDGE_THEMES.reduce(
        (acc, t) => {
          acc[t.id] = t.defaultExpanded;
          return acc;
        },
        {} as Record<string, boolean>
      )
  );
  const [rootExpanded, setRootExpanded] = useState(true);
  const [identityRole, setIdentityRole] = useState<WorkspaceRole>("admin");
  const [sandboxInput, setSandboxInput] = useState("");

  const charCount = useMemo(() => Array.from(prompt).length, [prompt]);

  const toggleTheme = (id: string) => {
    setExpandedThemes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Agent 管理
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <TabButton
            active={tab === "rules"}
            onClick={() => setTab("rules")}
            icon={<Pencil className="h-4 w-4" />}
            label="规则编辑器"
          />
          <TabButton
            active={tab === "structure"}
            onClick={() => setTab("structure")}
            icon={<Network className="h-4 w-4" />}
            label="知识结构"
          />
          <TabButton
            active={tab === "sandbox"}
            onClick={() => setTab("sandbox")}
            icon={<Play className="h-4 w-4" />}
            label="测试沙盒"
          />
        </div>
      </div>

      {tab === "rules" && (
        <section className="rounded-xl border border-border/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm md:p-5">
          <div className="mb-4 flex flex-col gap-3 border-b border-border/70 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold text-foreground">
              System Prompt
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <History className="h-4 w-4" />
                版本历史
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <Undo2 className="h-4 w-4" />
                回滚
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                <Save className="h-4 w-4" />
                保存
              </button>
            </div>
          </div>
          <textarea
            className="min-h-[min(420px,55vh)] w-full resize-y rounded-lg border border-border/80 bg-white px-3 py-3 font-mono text-sm leading-relaxed text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/35"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            spellCheck={false}
          />
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>字符数: {charCount}</span>
            <span>版本: v0.1（示意）</span>
          </div>
        </section>
      )}

      {tab === "structure" && (
        <section className="rounded-xl border border-border/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm md:p-5">
          <div className="mb-4 flex flex-col gap-1 border-b border-border/70 pb-3 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Agent 知识结构可视化
            </h3>
            <p className="text-xs text-muted-foreground">
              覆盖全部在管项目；节点「←」后为假定已入库的知识库文件名 · 点击展开
            </p>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 md:p-4">
            <button
              type="button"
              onClick={() => setRootExpanded((v) => !v)}
              className="flex w-full items-center gap-2 text-left"
            >
              {rootExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <Bot className="h-5 w-5 shrink-0 text-violet-600" />
              <span className="font-semibold text-foreground">
                合域 · 项目对话 Master Agent 知识图谱
              </span>
            </button>

            {rootExpanded && (
              <ul className="mt-2 space-y-1 border-l border-border/60 pl-4 md:pl-6">
                {AGENT_KNOWLEDGE_THEMES.map((theme) => {
                  const open = expandedThemes[theme.id] ?? false;
                  return (
                    <li key={theme.id} className="pt-2">
                      <button
                        type="button"
                        onClick={() => toggleTheme(theme.id)}
                        className="flex w-full items-start gap-2 rounded-md py-1 text-left transition hover:bg-muted/50"
                      >
                        {open ? (
                          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <Folder className="mt-0.5 h-4 w-4 shrink-0 text-amber-700/90" />
                        <span className="font-medium text-foreground">
                          {theme.title}
                        </span>
                      </button>
                      {open && (
                        <ul className="ml-6 mt-1 space-y-1.5 border-l border-dashed border-border/50 pl-3 md:ml-8">
                          {theme.facts.map((f, i) => (
                            <li
                              key={`${theme.id}-${i}`}
                              className="flex flex-wrap items-baseline gap-x-1.5 text-sm"
                            >
                              <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                              <span className="text-foreground">
                                {f.key}
                                {f.value ? `：${f.value}` : ""}
                              </span>
                              <span className="text-muted-foreground">
                                ← {f.source}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-violet-600" />
              知识主题
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              知识节点
            </span>
            <span>
              <span className="text-muted-foreground/80">←</span>{" "}
              知识库文件名（已入库示意）
            </span>
          </div>
        </section>
      )}

      {tab === "sandbox" && (
        <section className="rounded-xl border border-border/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm md:p-5">
          <div className="mb-4 flex flex-col gap-3 border-b border-border/70 pb-3 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="text-base font-semibold text-foreground">
              模拟对话测试
            </h3>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="text-sm text-muted-foreground">模拟角色：</span>
              <div className="flex flex-wrap gap-1.5">
                {SANDBOX_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    title={ROLE_LABEL[role]}
                    onClick={() => setIdentityRole(role)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition",
                      identityRole === role
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border/80 bg-white text-muted-foreground hover:bg-muted/60"
                    )}
                  >
                    {sandboxRoleShort(role)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            与工作台、对话监控一致：Admin / Core / Mid / Low / Guest；悬停芯片可看完整角色名称。
          </p>

          <div className="flex min-h-[min(280px,40vh)] items-center justify-center rounded-xl bg-muted/35 px-4 py-12 text-center text-sm text-muted-foreground">
            选择模拟角色（当前：{ROLE_LABEL[identityRole]}），开始模拟对话…
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              className="min-w-0 flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/35"
              placeholder="输入测试消息…"
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
            />
            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90"
              aria-label="发送"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

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
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border/80 bg-white text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
