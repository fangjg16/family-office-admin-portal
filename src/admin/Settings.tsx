import { useState } from "react";
import {
  Clock,
  Database,
  Download,
  FileText,
  Hexagon,
  KeyRound,
  ScrollText,
} from "lucide-react";
import { MOCK_PASSWORD_HINT } from "@/data/platform";
import { cn } from "@/lib/utils";

type RecentOp = {
  time: string;
  actor: string;
  summary: string;
};

/** 演示用最近操作流水（可对接审计 API） */
const RECENT_OPERATIONS: RecentOp[] = [
  {
    time: "04-14 09:18",
    actor: "CandiceGuo",
    summary: "更新了 Agent System Prompt（v0.1 示意）",
  },
  {
    time: "04-13 16:42",
    actor: "CandiceGuo",
    summary: "上传了知识库文档「离岸信托_CRS_受益人变更说明.pdf」",
  },
  {
    time: "04-13 08:30",
    actor: "CandiceGuo",
    summary: "导出了对话监控审计样本",
  },
  {
    time: "04-12 11:05",
    actor: "CandiceGuo",
    summary: "将账号「janice-hi」设为冻结",
  },
];

/** 模型下拉（示意）：名称 + 厂商，含国际与国内主流线路 */
const MODEL_GROUPS: {
  group: string;
  options: { value: string; label: string }[];
}[] = [
  {
    group: "OpenAI",
    options: [
      { value: "gpt-4o", label: "GPT-4o（OpenAI）" },
      { value: "gpt-4.1", label: "GPT-4.1（OpenAI）" },
      { value: "o3-mini", label: "o3-mini（OpenAI）" },
      { value: "gpt-4-turbo", label: "GPT-4 Turbo（OpenAI）" },
    ],
  },
  {
    group: "Anthropic",
    options: [
      { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet（Anthropic）" },
      { value: "claude-3-opus", label: "Claude 3 Opus（Anthropic）" },
      { value: "claude-3-haiku", label: "Claude 3 Haiku（Anthropic）" },
    ],
  },
  {
    group: "Google · Meta",
    options: [
      { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro（Google）" },
      { value: "gemini-2-flash", label: "Gemini 2.0 Flash（Google）" },
      { value: "llama-3.3-70b", label: "Llama 3.3 70B（Meta）" },
    ],
  },
  {
    group: "国内模型",
    options: [
      { value: "qwen-max", label: "通义千问 Qwen-Max（阿里云）" },
      { value: "qwen-plus", label: "通义千问 Qwen-Plus（阿里云）" },
      { value: "ernie-4", label: "文心一言 4.0（百度）" },
      { value: "hunyuan-pro", label: "混元大模型（腾讯）" },
      { value: "glm-4", label: "GLM-4（智谱 AI）" },
      { value: "baichuan-4", label: "Baichuan 4（百川智能）" },
      { value: "spark-v3", label: "星火认知大模型 V3.5（科大讯飞）" },
      { value: "kimi-moonshot", label: "Kimi（月之暗面）" },
      { value: "deepseek-v3", label: "DeepSeek-V3（深度求索）" },
      { value: "minimax-abab", label: "MiniMax-ABAB（MiniMax）" },
    ],
  },
];

export function SettingsPage() {
  const [model, setModel] = useState<string>(
    MODEL_GROUPS[0].options[0].value
  );
  const [apiKey, setApiKey] = useState("");
  const [dailyLimit, setDailyLimit] = useState(50);
  const [tokenWanPerDay, setTokenWanPerDay] = useState(120);

  return (
    <div className="w-full space-y-4">
      <div>
        <h2 className="font-display text-base font-semibold text-foreground md:text-lg">
          系统设置
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">
          模型与密钥、使用配额及数据导出（示意）
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <section className="rounded-xl border border-border/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <KeyRound className="h-4 w-4" strokeWidth={2} />
            </div>
            <h3 className="font-display text-sm font-semibold text-foreground">
              API 配置
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <label
                className="mb-1 block text-xs font-medium text-foreground"
                htmlFor="settings-model"
              >
                模型选择
              </label>
              <select
                id="settings-model"
                className="w-full rounded-lg border border-border bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/35"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
              {MODEL_GROUPS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
            <div>
              <label
                className="mb-1 block text-xs font-medium text-foreground"
                htmlFor="settings-apikey"
              >
                API Key
              </label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  id="settings-apikey"
                  type="password"
                  autoComplete="off"
                  placeholder="输入或粘贴密钥"
                  className="min-w-0 flex-1 rounded-lg border border-border bg-white px-3 py-1.5 font-mono text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/35"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                  type="button"
                  className="shrink-0 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/60"
                >
                  验证
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <Hexagon className="h-4 w-4" strokeWidth={2} />
            </div>
            <h3 className="font-display text-sm font-semibold text-foreground">
              使用限制
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <label
                className="mb-1 block text-xs font-medium text-foreground"
                htmlFor="settings-daily"
              >
                每用户每日对话上限
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="settings-daily"
                  type="number"
                  min={1}
                  max={9999}
                  className="w-20 rounded-lg border border-border bg-white px-2 py-1.5 text-center text-sm tabular-nums shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/35"
                  value={dailyLimit}
                  onChange={(e) =>
                    setDailyLimit(Math.max(1, Number(e.target.value) || 1))
                  }
                />
                <span className="text-xs text-muted-foreground sm:text-sm">
                  次 / 天
                </span>
              </div>
            </div>
            <div>
              <label
                className="mb-1 block text-xs font-medium text-foreground"
                htmlFor="settings-token-wan"
              >
                单用户每日 Token 上限（估算）
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="settings-token-wan"
                  type="number"
                  min={1}
                  max={9999}
                  className="w-24 rounded-lg border border-border bg-white px-2 py-1.5 text-center text-sm tabular-nums shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/35"
                  value={tokenWanPerDay}
                  onChange={(e) =>
                    setTokenWanPerDay(Math.max(1, Number(e.target.value) || 1))
                  }
                />
                <span className="text-xs text-muted-foreground sm:text-sm">
                  万
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Database className="h-4 w-4" strokeWidth={2} />
          </div>
          <h3 className="font-display text-sm font-semibold text-foreground">
            数据与日志
          </h3>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-white px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/60"
          >
            <Download className="h-3.5 w-3.5" />
            导出对话
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-white px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/60"
          >
            <FileText className="h-3.5 w-3.5" />
            导出用户
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-white px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/60"
          >
            <ScrollText className="h-3.5 w-3.5" />
            操作日志
          </button>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            最近操作
          </h4>
          <ul className="space-y-1.5">
            {RECENT_OPERATIONS.map((op, i) => (
              <li
                key={i}
                className={cn(
                  "flex gap-2.5 rounded-lg border border-border/60 bg-white px-2.5 py-2 text-sm shadow-sm",
                  "items-start sm:items-center"
                )}
              >
                <Clock
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground sm:mt-0"
                  strokeWidth={2}
                />
                <div className="min-w-0 flex-1 text-xs leading-relaxed sm:text-sm">
                  <span className="tabular-nums text-muted-foreground">
                    {op.time}
                  </span>
                  <span className="mx-2 text-border">·</span>
                  <span className="font-medium text-foreground">{op.actor}</span>
                  <span className="text-muted-foreground"> {op.summary}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="rounded-xl border border-border/80 bg-white/90 px-4 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
        <p className="text-xs font-medium text-foreground">访问说明</p>
        <p className="mt-1.5 text-xs leading-relaxed">{MOCK_PASSWORD_HINT}</p>
      </div>
    </div>
  );
}
