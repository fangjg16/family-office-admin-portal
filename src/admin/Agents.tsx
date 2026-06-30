import { useMemo, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  CircleDot,
  FileCode2,
  GitBranch,
  Network,
  Pencil,
  Play,
  Save,
  Send,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { ROLE_LABEL, type WorkspaceRole } from "@/data/platform";
import { cn } from "@/lib/utils";

type AgentTab = "rules" | "structure" | "sandbox";

const SANDBOX_ROLES: WorkspaceRole[] = [
  "admin",
  "core",
  "mid",
  "low",
  "guest",
];

type RuleVersion = {
  version: string;
  time: string;
  actor: string;
  note: string;
  current?: boolean;
};

const RULE_VERSIONS: RuleVersion[] = [
  {
    version: "v0.5",
    time: "04-16 15:00",
    actor: "CandiceGuo",
    note: "发布「意图路由规则」与兜底触发阈值",
    current: true,
  },
  {
    version: "v0.4",
    time: "04-15 19:20",
    actor: "CandiceGuo",
    note: "补充跨领域问题并行路由说明",
  },
  {
    version: "v0.3",
    time: "04-13 10:08",
    actor: "CandiceGuo",
    note: "增加越权请求拒答模板与升级路径",
  },
  {
    version: "v0.2",
    time: "04-12 16:32",
    actor: "CandiceGuo",
    note: "统一角色粒度与知识库引用口径",
  },
];

type SandboxCase = {
  id: string;
  label: string;
  status: "pass" | "pending";
};

const SANDBOX_CASES: SandboxCase[] = [
  { id: "case-1", label: "Core 查询项目净值（带来源）", status: "pass" },
  { id: "case-2", label: "Low 请求底层资产明细被拦截", status: "pass" },
  { id: "case-3", label: "Mid 仅返回脱敏金额区间", status: "pending" },
  { id: "case-4", label: "多领域问题拆分并行路由", status: "pending" },
  { id: "case-5", label: "知识库无结果时触发兜底", status: "pending" },
];

type RuleFileStatus = "ok" | "draft";
type RuleFile = { id: string; label: string; status: RuleFileStatus };
type RuleGroup = { id: string; label: string; files: RuleFile[] };

const ARCH_RULE_GROUPS: RuleGroup[] = [
  {
    id: "global",
    label: "全局规则 (Global)",
    files: [
      { id: "persona", label: "全局人设", status: "ok" },
      { id: "safety", label: "安全规则", status: "ok" },
      { id: "permission", label: "权限矩阵", status: "ok" },
      { id: "compliance", label: "合规话术模板", status: "ok" },
    ],
  },
  {
    id: "master",
    label: "Master Agent (调度中枢)",
    files: [
      { id: "master-prompt", label: "System Prompt", status: "ok" },
      { id: "routing", label: "意图路由规则", status: "ok" },
      { id: "fallback", label: "回退兜底规则", status: "ok" },
    ],
  },
  {
    id: "invest",
    label: "投资数据 Agent",
    files: [
      { id: "invest-prompt", label: "System Prompt", status: "ok" },
      { id: "invest-kb", label: "知识库绑定", status: "ok" },
      { id: "invest-tools", label: "工具定义", status: "draft" },
    ],
  },
  {
    id: "gov",
    label: "家族治理 Agent",
    files: [
      { id: "gov-prompt", label: "System Prompt", status: "ok" },
      { id: "gov-kb", label: "知识库绑定", status: "ok" },
    ],
  },
];

const RULE_CONTENT_BY_ID: Record<string, string> = {
  persona: `## 全局人设 (Global Persona)
## 版本：v0.5 | 最后修改：2026-04-16 15:00

你是「合域」家族办公室的专属智能助手，名称为「家族管家」。

### 语气规范
- 专业、克制、礼貌，优先中文回复。
- 不堆砌术语，如需专业术语需附带解释。
- 不夸大收益，不给出无法验证结论。

### 对话原则
- 能简答不长答；用户要细节时再展开。
- 对高风险话题给出下一步建议，不直接下结论。
- 不伪装为真人，不编造身份或来源。`,
  safety: `## 安全规则
## 版本：v0.4

1. 涉及违法、洗钱、规避监管、伪造材料等请求，必须拒绝。
2. 涉及账户隐私、身份证明、联系方式等敏感信息，默认不展示。
3. 任何投资回报仅可引用已披露资料，不可承诺收益。
4. 用户诱导越权时，返回标准拒答模板并记录审计标签。`,
  permission: `## 权限矩阵
## 版本：v0.4

- Admin：可见平台配置、审计信息、全项目运营数据。
- Core：可见本家族授权项目核心数据，跨家族信息不可见。
- Mid：只返回脱敏信息与区间值，不返回底层主体映射。
- Low：仅返回流程、风险提示与升级路径。
- Guest：仅可访问公开级摘要与通用问答。`,
  compliance: `## 合规话术模板
## 版本：v0.3

### 超权限
“当前会话权限暂不支持查看该信息，建议联系项目管理员提交申请。”

### 无资料命中
“目前知识库未检索到可核验资料，我可以为您转人工顾问跟进。”

### 高风险事项
“该事项涉及合规审查，建议以正式文件和顾问意见为准。”`,
  "master-prompt": `## Master Agent System Prompt
## 版本：v0.5

角色：总调度中枢。负责意图识别、路由决策、结果汇总、权限过滤。

流程：
1) 解析用户问题并识别领域
2) 根据路由规则分发到对应 Sub-Agent
3) 汇总结果并应用权限过滤
4) 返回统一风格答案并附来源线索`,
  routing: `## 意图路由规则 (Intent Routing)
## 版本：v0.5

- 净值/收益/持仓/赎回进度 -> 投资数据 Agent
- 税务/合规/跨境申报 -> 税务咨询 Agent
- 信托/传承/治理结构 -> 家族治理 Agent
- 通用问候/操作说明 -> 通用助手 Agent

多领域问题：可并行路由，最终由 Master 汇总。`,
  fallback: `## 回退兜底规则 (Fallback)
## 版本：v0.3

触发条件：
- 意图识别置信度 < 0.70
- Sub-Agent 无可用结果
- 检索结果冲突且无法校验

处理动作：
1) 礼貌告知信息不足
2) 给出人工跟进路径
3) 打标“需人工关注”并写入审计`,
  "invest-prompt": `## 投资数据 Agent - System Prompt
## 版本：v0.4

仅回答净值、规模、起投、收益区间、持仓结构等投资数据问题。
所有数字必须可回溯到知识库文件，不做预测，不做收益承诺。`,
  "invest-kb": `## 投资数据 Agent - 知识库绑定
## 版本：v0.2

- 恒信地产基金_2024Q4季报_净值披露.pdf
- 远景股权基金_估值更新_2026Q1.pdf
- 稳盈固收增强_月度净值快报_2026-03.pdf

命中规则：优先最新版本；同名文档按发布时间降序。`,
  "invest-tools": `## 投资数据 Agent - 工具定义
## 版本：v0.1 | 状态：草稿

tool.query_nav(project_id, date_range)
tool.query_aum(project_id)
tool.query_minimum_investment(project_id)

输出要求：必须返回 source_file 与 source_section。`,
  "gov-prompt": `## 家族治理 Agent - System Prompt
## 版本：v0.3

回答范围：家族治理机制、信托流程、受益人变更、会议机制等。
涉及法律意见时必须提示“仅供参考，以正式法律意见为准”。`,
  "gov-kb": `## 家族治理 Agent - 知识库绑定
## 版本：v0.2

- 家族治理章程_2025修订版.pdf
- 信托受益人变更流程_内部SOP_v3.pdf
- 家族会议决策机制_执行手册.pdf`,
};

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
  const [identityRole, setIdentityRole] = useState<WorkspaceRole>("admin");
  const [sandboxInput, setSandboxInput] = useState("");
  const [selectedRuleId, setSelectedRuleId] = useState("persona");
  const [ruleDrafts, setRuleDrafts] =
    useState<Record<string, string>>(RULE_CONTENT_BY_ID);

  const selectedRule = useMemo(
    () =>
      ARCH_RULE_GROUPS.flatMap((g) => g.files).find((f) => f.id === selectedRuleId) ??
      ARCH_RULE_GROUPS[0].files[0],
    [selectedRuleId]
  );
  const currentRuleContent = ruleDrafts[selectedRuleId] ?? "";
  const charCount = useMemo(
    () => Array.from(currentRuleContent).length,
    [currentRuleContent]
  );

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
            label="架构可视化"
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
        <section className="rounded-xl border border-border/80 bg-white/95 shadow-sm backdrop-blur-sm">
          <div className="grid min-h-[560px] lg:grid-cols-[250px_minmax(0,1fr)_250px]">
            <aside className="border-b border-border/70 p-3 lg:border-b-0 lg:border-r">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">规则库</h4>
                <button
                  type="button"
                  className="rounded-md border border-border/80 bg-white px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
                >
                  + 新建
                </button>
              </div>
              <div className="space-y-2">
                {ARCH_RULE_GROUPS.map((group) => (
                  <div key={group.id}>
                    <p className="mb-1 text-xs font-semibold text-foreground/85">
                      {group.label}
                    </p>
                    <ul className="space-y-1">
                      {group.files.map((file) => {
                        const active = file.id === selectedRuleId;
                        return (
                          <li key={file.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedRuleId(file.id)}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition",
                                active
                                  ? "bg-primary/12 text-primary"
                                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                              )}
                            >
                              <span className="truncate">{file.label}</span>
                              <span
                                className={cn(
                                  "ml-auto h-1.5 w-1.5 rounded-full",
                                  file.status === "ok"
                                    ? "bg-[hsl(var(--sage))]"
                                    : "bg-[hsl(var(--terracotta))]"
                                )}
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </aside>

            <div className="border-b border-border/70 p-4 lg:border-b-0 lg:border-r">
              <div className="mb-3 flex flex-col gap-2 border-b border-border/70 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {selectedRule.label} / Prompt 编辑区
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[hsl(var(--terracotta)/0.14)] px-2 py-0.5 text-[10px] font-semibold text-[hsl(18_28%_38%)]">
                    草稿
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-white px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted/60"
                  >
                    <Save className="h-3.5 w-3.5" />
                    保存草稿
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md bg-[hsl(var(--wine-deep))] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--wine-deep-foreground))] transition hover:bg-[hsl(353_42%_28%)]"
                  >
                    发布上线
                  </button>
                </div>
              </div>

              <div className="mb-3 grid gap-2 sm:grid-cols-3">
                <RuleMetaChip
                  icon={<FileCode2 className="h-3.5 w-3.5" />}
                  label="当前版本"
                  value="v0.5"
                />
                <RuleMetaChip
                  icon={<GitBranch className="h-3.5 w-3.5" />}
                  label="路由策略"
                  value="5 条生效"
                />
                <RuleMetaChip
                  icon={<ShieldAlert className="h-3.5 w-3.5" />}
                  label="兜底规则"
                  value="阈值 0.70"
                />
              </div>

              <textarea
                className="min-h-[min(420px,54vh)] w-full resize-y rounded-lg border border-border/80 bg-white px-3 py-3 font-mono text-sm leading-relaxed text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/35"
                value={currentRuleContent}
                onChange={(e) =>
                  setRuleDrafts((prev) => ({
                    ...prev,
                    [selectedRuleId]: e.target.value,
                  }))
                }
                spellCheck={false}
              />
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>字符数: {charCount}</span>
                <span>版本: v0.5（示意）</span>
                <span>最后修改: 2026-04-16 15:00</span>
              </div>
            </div>

            <aside className="p-3">
              <div className="space-y-3">
                <section className="rounded-lg border border-border/70 bg-white p-2.5">
                  <h4 className="text-xs font-semibold text-foreground">文件信息</h4>
                  <div className="mt-1.5 space-y-1 text-[11px] text-muted-foreground">
                    <p>
                      文件：<span className="text-foreground">{selectedRule.label}</span>
                    </p>
                    <p>类型：Prompt</p>
                    <p>
                      状态：
                      <span
                        className={cn(
                          "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                          selectedRule.status === "ok"
                            ? "bg-[hsl(var(--sage)/0.14)] text-[hsl(145_22%_32%)]"
                            : "bg-[hsl(var(--terracotta)/0.14)] text-[hsl(18_28%_38%)]"
                        )}
                      >
                        {selectedRule.status === "ok" ? "已发布" : "草稿"}
                      </span>
                    </p>
                    <p>线上：v0.4</p>
                    <p>修改：04-15 14:32</p>
                    <p>修改者：CandiceGuo</p>
                  </div>
                </section>

                <section className="rounded-lg border border-border/70 bg-white p-2.5">
                  <h4 className="text-xs font-semibold text-foreground">版本历史</h4>
                  <div className="mt-2 space-y-1.5 text-[11px]">
                    {RULE_VERSIONS.map((v) => (
                      <div
                        key={v.version}
                        className={cn(
                          "rounded-md border px-2 py-1.5",
                          v.current
                            ? "border-primary/40 bg-primary/5"
                            : "border-border/60 bg-muted/20"
                        )}
                      >
                        <p className="font-semibold text-foreground">{v.version}</p>
                        <p className="text-muted-foreground">{v.time}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-border/70 bg-white p-2.5">
                  <h4 className="text-xs font-semibold text-foreground">关联</h4>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    被多个 Agent 引用，影响语气和称呼，优先级：高。
                  </p>
                </section>

                <section className="rounded-lg border border-border/70 bg-white p-2.5">
                  <h4 className="text-xs font-semibold text-foreground">操作</h4>
                  <div className="mt-1.5 space-y-1.5">
                    <SidebarBtn>对比版本差异</SidebarBtn>
                    <SidebarBtn>回滚到线上版本</SidebarBtn>
                    <SidebarBtn>导出规则文件</SidebarBtn>
                    <SidebarBtn>进入沙盒验证</SidebarBtn>
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </section>
      )}

      {tab === "structure" && (
        <section className="rounded-xl border border-border/80 bg-white/95 shadow-sm backdrop-blur-sm">
          <div className="grid min-h-[560px] lg:grid-cols-[250px_minmax(0,1fr)_250px]">
            <aside className="border-b border-border/70 p-3 lg:border-b-0 lg:border-r">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">规则库</h4>
                <button
                  type="button"
                  className="rounded-md border border-border/80 bg-white px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
                >
                  + 新建
                </button>
              </div>
              <div className="space-y-2">
                {ARCH_RULE_GROUPS.map((group) => (
                  <div key={group.id}>
                    <p className="mb-1 text-xs font-semibold text-foreground/85">
                      {group.label}
                    </p>
                    <ul className="space-y-1">
                      {group.files.map((file) => {
                        const active = file.id === selectedRuleId;
                        return (
                          <li key={file.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedRuleId(file.id)}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition",
                                active
                                  ? "bg-primary/12 text-primary"
                                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                              )}
                            >
                              <span className="truncate">{file.label}</span>
                              <span
                                className={cn(
                                  "ml-auto h-1.5 w-1.5 rounded-full",
                                  file.status === "ok"
                                    ? "bg-[hsl(var(--sage))]"
                                    : "bg-[hsl(var(--terracotta))]"
                                )}
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </aside>

            <div className="border-b border-border/70 p-4 lg:border-b-0 lg:border-r">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Multi-Agent 架构总览
              </h3>
              <div className="space-y-1 text-center">
                <div className="inline-flex rounded-lg border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-foreground">
                  👤 用户提问
                </div>
                <div className="text-muted-foreground">↓</div>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <BadgeNode>安全规则</BadgeNode>
                  <BadgeNode>全局人设</BadgeNode>
                  <BadgeNode>权限矩阵</BadgeNode>
                  <BadgeNode>合规模板</BadgeNode>
                </div>
                <p className="text-[11px] text-[hsl(18_28%_38%)]">
                  ▲ 全局规则层：所有 Agent 必须遵守
                </p>
                <div className="text-muted-foreground">↓</div>
                <div className="mx-auto inline-flex rounded-xl border border-[hsl(var(--wine-mid)/0.45)] bg-[hsl(var(--wine-muted)/0.7)] px-4 py-2 text-sm font-semibold text-[hsl(var(--wine-deep))]">
                  🎯 Master Agent（调度中枢）
                </div>
                <p className="text-[11px] text-muted-foreground">
                  意图识别 → 路由决策 → 结果汇总
                </p>
                <div className="text-muted-foreground">↓</div>
                <p className="text-[11px] text-primary">意图路由规则</p>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <SubAgentNode
                    title="投资数据"
                    desc="净值·收益·持仓"
                    source="项目资料"
                  />
                  <SubAgentNode
                    title="税务咨询"
                    desc="税务·合规·跨境"
                    source="税务法规"
                  />
                  <SubAgentNode
                    title="家族治理"
                    desc="信托·传承·治理"
                    source="治理文件"
                  />
                  <SubAgentNode
                    title="通用助手"
                    desc="闲聊·FAQ·引导"
                    source="通用 FAQ"
                  />
                </div>
                <div className="text-muted-foreground">↓</div>
                <div className="mx-auto inline-flex rounded-lg border border-[hsl(var(--wine-mid)/0.45)] bg-[hsl(var(--wine-muted)/0.7)] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--wine-deep))]">
                  🔄 Master 汇总 + 权限过滤
                </div>
                <div className="text-muted-foreground">↓</div>
                <div className="inline-flex rounded-lg border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-foreground">
                  💬 回复用户
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-[hsl(var(--terracotta)/0.35)] bg-[hsl(var(--terracotta)/0.1)] px-3 py-2">
                <p className="text-xs font-semibold text-[hsl(18_28%_32%)]">回退机制</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[hsl(18_28%_38%)]">
                  当意图识别置信度小于 0.70 或 Sub-Agent 无结果时，触发兜底规则并标记需人工关注。
                </p>
              </div>
            </div>

            <aside className="p-3">
              <div className="space-y-3">
                <section className="rounded-lg border border-border/70 bg-white p-2.5">
                  <h4 className="text-xs font-semibold text-foreground">文件信息</h4>
                  <div className="mt-1.5 space-y-1 text-[11px] text-muted-foreground">
                    <p>
                      文件：<span className="text-foreground">{selectedRule.label}</span>
                    </p>
                    <p>类型：Prompt</p>
                    <p>
                      状态：
                      <span
                        className={cn(
                          "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                          selectedRule.status === "ok"
                            ? "bg-[hsl(var(--sage)/0.14)] text-[hsl(145_22%_32%)]"
                            : "bg-[hsl(var(--terracotta)/0.14)] text-[hsl(18_28%_38%)]"
                        )}
                      >
                        {selectedRule.status === "ok" ? "已发布" : "草稿"}
                      </span>
                    </p>
                    <p>线上：v0.4</p>
                    <p>修改：04-15 14:32</p>
                    <p>修改者：CandiceGuo</p>
                  </div>
                </section>

                <section className="rounded-lg border border-border/70 bg-white p-2.5">
                  <h4 className="text-xs font-semibold text-foreground">版本历史</h4>
                  <div className="mt-2 space-y-1.5 text-[11px]">
                    {RULE_VERSIONS.map((v) => (
                      <div
                        key={v.version}
                        className={cn(
                          "rounded-md border px-2 py-1.5",
                          v.current
                            ? "border-primary/40 bg-primary/5"
                            : "border-border/60 bg-muted/20"
                        )}
                      >
                        <p className="font-semibold text-foreground">{v.version}</p>
                        <p className="text-muted-foreground">{v.time}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-border/70 bg-white p-2.5">
                  <h4 className="text-xs font-semibold text-foreground">关联</h4>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    被多个 Agent 引用，影响语气和称呼，优先级：高。
                  </p>
                </section>

                <section className="rounded-lg border border-border/70 bg-white p-2.5">
                  <h4 className="text-xs font-semibold text-foreground">操作</h4>
                  <div className="mt-1.5 space-y-1.5">
                    <SidebarBtn>对比版本差异</SidebarBtn>
                    <SidebarBtn>回滚到线上版本</SidebarBtn>
                    <SidebarBtn>导出规则文件</SidebarBtn>
                    <SidebarBtn>进入沙盒验证</SidebarBtn>
                  </div>
                </section>
              </div>
            </aside>
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

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_250px]">
            <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
              <div className="space-y-3">
                <div className="max-w-[86%] rounded-xl border border-border/80 bg-white px-3 py-2 text-sm text-foreground">
                  恒信地产基金最新净值是多少？请带来源说明。
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    访客 · 10:00
                  </p>
                </div>
                <div className="ml-auto max-w-[90%] rounded-xl bg-primary/95 px-3 py-2 text-sm text-primary-foreground">
                  根据 2024 年 12 月季报，最新单位净值为 1.1523，累计净值 1.4280。来源：恒信地产基金_2024Q4季报_净值披露.pdf。
                  <p className="mt-1 text-[11px] text-primary-foreground/80">
                    家族管家 · 路由-&gt;投资数据 Agent
                  </p>
                </div>
                <div className="rounded-lg border border-dashed border-border/80 bg-white/80 px-3 py-2 text-xs text-muted-foreground">
                  当前角色：{ROLE_LABEL[identityRole]} · 规则版本 v0.5 · 兜底阈值 0.70
                </div>
              </div>
            </div>
            <aside className="rounded-xl border border-border/70 bg-white px-3 py-3">
              <h4 className="mb-2 text-sm font-semibold text-foreground">
                沙盒检查清单
              </h4>
              <ul className="space-y-1.5 text-xs">
                {SANDBOX_CASES.map((c) => (
                  <li key={c.id} className="flex items-start gap-1.5">
                    {c.status === "pass" ? (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--sage))]" />
                    ) : (
                      <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--terracotta))]" />
                    )}
                    <span className="leading-relaxed text-foreground/90">{c.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-lg border border-border/70 bg-muted/25 px-2.5 py-2 text-[11px] leading-relaxed text-muted-foreground">
                已通过 2 / 5，建议优先回归「多领域并行路由」和「兜底触发」。
              </div>
            </aside>
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
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border/80 bg-white px-3 text-xs font-medium text-foreground transition hover:bg-muted/50"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              一键回放
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

function RuleMetaChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 px-2.5 py-2">
      <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function BadgeNode({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[hsl(var(--terracotta)/0.35)] bg-[hsl(var(--terracotta)/0.12)] px-2.5 py-1 text-[11px] font-medium text-[hsl(18_28%_38%)]">
      {children}
    </span>
  );
}

function SubAgentNode({
  title,
  desc,
  source,
}: {
  title: string;
  desc: string;
  source: string;
}) {
  return (
    <div className="rounded-lg border border-[hsl(var(--sage)/0.35)] bg-[hsl(var(--sage)/0.1)] px-2.5 py-2">
      <p className="text-xs font-semibold text-[hsl(145_22%_30%)]">{title}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{desc}</p>
      <p className="mt-0.5 text-[11px] text-[hsl(var(--sage))]">📚 {source}</p>
    </div>
  );
}

function SidebarBtn({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="w-full rounded-md border border-border/70 bg-white px-2 py-1.5 text-left text-[11px] text-foreground transition hover:bg-muted/50"
    >
      {children}
    </button>
  );
}
