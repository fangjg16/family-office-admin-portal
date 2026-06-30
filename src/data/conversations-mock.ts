/**
 * 对话监控类型与视图筛选；会话数据来自主平台 chat-state API（见 conversations-from-api.ts）。
 */

export type RiskLevel = "正常" | "提示" | "关注" | "拦截";

export type ConvTurn = {
  role: "user" | "assistant";
  content: string;
  time: string;
};

export type LifecycleQueue =
  | "对话跟进中"
  | "待合规复核"
  | "已归档";

export type ConversationRow = {
  id: string;
  sessionId: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  userOrg: string;
  roleTier: "Admin" | "Core" | "Mid" | "Low" | "Guest";
  startedAt: string;
  lastActiveAt: string;
  messages: number;
  tokensEst: number;
  risk: RiskLevel;
  policyHits: string[];
  lastIntent: string;
  lastSnippet: string;
  exported: boolean;
  channel: "项目对话" | "内部评测";
  lifecycleQueue: LifecycleQueue;
  toolsInvoked: string[];
  kbCitations: number;
  turns: ConvTurn[];
};

/** 视图分栏：全部 / 待处理 / 策略命中 / 已归档 */
export function matchConversationView(
  row: ConversationRow,
  view: "all" | "pending" | "policy" | "archived"
): boolean {
  if (view === "all") return true;
  if (view === "policy") return row.policyHits.length > 0;
  if (view === "archived")
    return row.lifecycleQueue === "已归档" || row.exported;
  if (view === "pending") {
    return (
      row.lifecycleQueue === "待合规复核" ||
      row.risk === "关注" ||
      row.risk === "拦截"
    );
  }
  return true;
}
