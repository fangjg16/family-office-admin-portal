/**
 * 从主平台 chat-state API 提取真实对话，生成静态示例数据。
 * 用法：node scripts/sync-conversations.mjs
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const API_BASE = "https://jfo-api.jfo-api.workers.dev";
const SYNCED_AT = new Date().toISOString().slice(0, 10);
const MAX_EXAMPLES = 12;
const TURN_LIMIT = 8;
const TURN_CHAR_LIMIT = 900;

const PROJECTS = [
  { id: "proj-87c4b0718f58", name: "PET 源天生物" },
  { id: "proj-4a974e67c0f9", name: "演员AI版权投资" },
  { id: "proj-535a240acf88", name: "多肽产品中澳供应链" },
  { id: "proj-7c0f947a6a00", name: "中国-中亚易货贸易" },
];

const USERS = [
  {
    id: "candice-guo",
    displayName: "CandiceGuo",
    orgTitle: "合域 · Admin",
    role: "admin",
  },
  {
    id: "jimmy-huang",
    displayName: "JimmyHuang",
    orgTitle: "家族办公室 · Core 核心级",
    role: "core",
  },
  {
    id: "jessica-hu",
    displayName: "JessicaHu",
    orgTitle: "投资顾问 · Advanced 进阶级",
    role: "mid",
  },
  {
    id: "jensen-fang",
    displayName: "JensenFang",
    orgTitle: "研究部 · Basic 基础级",
    role: "low",
  },
  {
    id: "janice-hi",
    displayName: "JaniceHi",
    orgTitle: "访客 · Guest",
    role: "guest",
  },
];

const ROLE_TIER = {
  admin: "Admin",
  core: "Core 核心级",
  mid: "Advanced 进阶级",
  low: "Basic 基础级",
  guest: "Guest",
};

function normalizeTimestamp(raw) {
  const t = String(raw).trim().replace(/\//g, "-");
  const m = t.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]} ${m[4]}`;
  return t;
}

function projectNameFor(projectId, title) {
  const p = PROJECTS.find((x) => x.id === projectId);
  if (p) return p.name;
  const head = title.split("·")[0]?.trim();
  return head || projectId;
}

function estimateTokens(messages) {
  return messages.reduce((s, m) => s + Math.ceil(m.content.length / 3.5), 0);
}

function detectPolicyHits(messages) {
  const hits = [];
  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");
  if (/生产环境|api\s*key|密钥|密码/i.test(userText)) {
    hits.push("疑似索取生产配置或密钥");
  }
  if (/身份证|护照号|银行卡/i.test(userText)) {
    hits.push("疑似敏感身份信息");
  }
  if (/监管|合规|TGA|CRS/i.test(userText) && userText.length > 200) {
    hits.push("涉及监管合规深度讨论");
  }
  if (messages.some((m) => m.knowledgeNetworkHtml)) {
    hits.push("含知识网络 HTML 产出");
  }
  return hits;
}

function detectTools(messages) {
  const tools = new Set();
  if (messages.some((m) => m.files?.length)) tools.add("session_upload");
  if (messages.some((m) => /知识网络|knowledge.network/i.test(m.content))) {
    tools.add("knowledge_network");
  }
  if (messages.some((m) => m.id?.includes("assistant-job"))) {
    tools.add("agent_job");
  }
  if (messages.some((m) => m.knowledgeNetworkHtml)) {
    tools.add("kn_html_emit");
  }
  return [...tools];
}

function deriveRisk(user, policyHits, messages) {
  const blocked = messages.some((m) =>
    /已拦截|无权进入|禁止输出/i.test(m.content)
  );
  if (blocked) return "拦截";
  if (user.role === "guest") return "提示";
  if (policyHits.some((h) => h.includes("敏感") || h.includes("密钥"))) {
    return "关注";
  }
  if (policyHits.length > 0) return "提示";
  return "正常";
}

function deriveQueue(risk, policyHits) {
  if (risk === "关注" || risk === "拦截" || policyHits.length > 0) {
    return "待合规复核";
  }
  return "对话跟进中";
}

function lastUserMessage(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i];
  }
  return undefined;
}

function snippetLine(text, max) {
  const one = text.replace(/\s+/g, " ").trim();
  return one.length > max ? `${one.slice(0, max)}…` : one;
}

function toTurns(messages) {
  return messages.slice(-TURN_LIMIT).map((m) => ({
    role: m.role,
    time: m.time.replace(/\//g, "-").slice(-8) || m.time,
    content:
      m.content.length > TURN_CHAR_LIMIT
        ? `${m.content.slice(0, TURN_CHAR_LIMIT)}…`
        : m.content,
  }));
}

function buildRow(user, conv, messages) {
  const policyHits = detectPolicyHits(messages);
  const risk = deriveRisk(user, policyHits, messages);
  const lastUser = lastUserMessage(messages);
  const startedAt =
    messages.length > 0
      ? normalizeTimestamp(messages[0].time)
      : normalizeTimestamp(conv.updatedAt);

  return {
    id: `${user.id}::${conv.id}`,
    sessionId: conv.id,
    projectId: conv.projectId,
    projectName: projectNameFor(conv.projectId, conv.title),
    userId: user.id,
    userName: user.displayName,
    userOrg: user.orgTitle,
    roleTier: ROLE_TIER[user.role],
    startedAt,
    lastActiveAt: normalizeTimestamp(conv.updatedAt),
    messages: messages.length,
    tokensEst: estimateTokens(messages),
    risk,
    policyHits,
    lastIntent: lastUser
      ? snippetLine(lastUser.content, 48)
      : snippetLine(conv.preview || "", 48),
    lastSnippet: conv.preview || lastUser?.content || "—",
    exported: false,
    channel: "项目对话",
    lifecycleQueue: deriveQueue(risk, policyHits),
    toolsInvoked: detectTools(messages),
    kbCitations: messages.filter((m) => m.knowledgeNetworkHtml).length,
    turns: toTurns(messages),
  };
}

function pickExamples(rows) {
  const withDialogue = rows.filter((r) => r.messages >= 2);
  withDialogue.sort((a, b) => b.lastActiveAt.localeCompare(a.lastActiveAt));

  const picked = [];
  const seenUser = new Set();

  // 每位用户至少 1 条（若有对话）
  for (const row of withDialogue) {
    if (!seenUser.has(row.userId)) {
      picked.push(row);
      seenUser.add(row.userId);
    }
    if (picked.length >= MAX_EXAMPLES) break;
  }

  // 补足至 MAX_EXAMPLES：优先策略命中、消息较多
  if (picked.length < MAX_EXAMPLES) {
    const rest = withDialogue
      .filter((r) => !picked.some((p) => p.id === r.id))
      .sort((a, b) => {
        const score = (r) =>
          r.policyHits.length * 10 + r.messages + (r.kbCitations > 0 ? 5 : 0);
        return score(b) - score(a);
      });
    for (const row of rest) {
      if (picked.length >= MAX_EXAMPLES) break;
      picked.push(row);
    }
  }

  picked.sort((a, b) => b.lastActiveAt.localeCompare(a.lastActiveAt));
  return picked;
}

async function fetchUserChatState(userId) {
  const res = await fetch(
    `${API_BASE}/api/users/${encodeURIComponent(userId)}/chat-state`
  );
  if (!res.ok) throw new Error(`${userId}: HTTP ${res.status}`);
  return res.json();
}

async function main() {
  const allRows = [];

  for (const user of USERS) {
    try {
      const state = await fetchUserChatState(user.id);
      for (const conv of state.conversations ?? []) {
        if (/测试新建|test/i.test(conv.projectId) || /测试新建/.test(conv.title)) {
          continue;
        }
        const messages = state.messagesByConversation?.[conv.id] ?? [];
        if (messages.length === 0 && !conv.preview?.trim()) continue;
        allRows.push(buildRow(user, conv, messages));
      }
      console.log(`✓ ${user.displayName}: ${(state.conversations ?? []).length} 会话`);
    } catch (e) {
      console.warn(`✗ ${user.id}:`, e.message);
    }
  }

  const examples = pickExamples(allRows);
  console.log(`\n选取 ${examples.length} 条示例（共扫描 ${allRows.length} 条）`);

  const out = `/**
 * 对话监控示例数据 — 从主平台 chat-state API 提取的真实会话快照。
 * 最后同步：${SYNCED_AT}
 * 重新生成：node scripts/sync-conversations.mjs
 */

import type { ConversationRow } from "./conversations-mock";

export const CONVERSATIONS_SYNCED_AT = "${SYNCED_AT}";

export const CONVERSATIONS: ConversationRow[] = ${JSON.stringify(examples, null, 2)};
`;

  const root = dirname(fileURLToPath(import.meta.url));
  const target = join(root, "..", "src", "data", "conversations.ts");
  writeFileSync(target, out, "utf8");
  console.log(`已写入 ${target}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
