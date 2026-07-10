import { clearAdminSession, loadAdminToken } from "./admin-session";

export const JFO_API_BASE = (
  (import.meta.env.VITE_JFO_API_BASE as string | undefined)?.trim() ||
  "https://jfo-api.jfo-api.workers.dev"
).replace(/\/+$/u, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(text || res.statusText || "响应解析失败", res.status);
  }
}

function authHeaders(): HeadersInit {
  const token = loadAdminToken();
  if (!token) return { "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function adminLogin(
  username: string,
  password: string,
): Promise<{ token: string; username: string }> {
  const res = await fetch(`${JFO_API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await parseJson<{ ok?: boolean; token?: string; username?: string; error?: string }>(
    res,
  );
  if (!res.ok) {
    throw new ApiError(data.error || "登录失败", res.status);
  }
  if (!data.token) throw new ApiError("登录响应缺少 token", res.status);
  return { token: data.token, username: data.username || username };
}

export type ApiProject = {
  id: string;
  name: string;
  category: string;
  phase: string;
  summary: string;
  guestSummary: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiUser = {
  id: string;
  displayName: string;
  orgTitle: string;
  avatarChar: string;
  email: string;
  organization: string;
  role: "admin" | "core" | "mid" | "low" | "guest";
  projectCount: number;
  lastLogin: string;
  accountStatus: "正常" | "冻结" | "待激活";
  phoneMasked: string;
  conversationCount: number;
  projectAccess: { projectId: string; projectName: string; accessLabel: string }[];
};

export type ApiConversation = {
  id: string;
  sessionId: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  userOrg: string;
  roleTier: string;
  startedAt: string;
  lastActiveAt: string;
  messages: number;
  tokensEst: number;
  risk: "正常" | "提示" | "关注" | "拦截";
  policyHits: string[];
  lastIntent: string;
  lastSnippet: string;
  exported: boolean;
  channel: "项目对话" | "内部评测";
  lifecycleQueue: "对话跟进中" | "待合规复核" | "已归档";
  toolsInvoked: string[];
  kbCitations: number;
  turns: { role: "user" | "assistant"; content: string; time: string }[];
};

export type ApiProjectDocument = {
  filename: string;
  parseStatus: "已解析" | "解析中" | "失败";
  uploadedAt: string;
  uploadedBy: string | null;
  uploadedByName: string | null;
};

export type ApiSessionDocument = ApiProjectDocument & {
  userId: string;
  userName: string;
  conversationId: string;
};

export type ApiProjectDocuments = {
  projectDocuments: ApiProjectDocument[];
  conversationDocuments: ApiSessionDocument[];
};

export type ApiAuditEntry = {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;
  event: "created" | "deleted";
  role: "user" | "assistant";
  contentPreview: string;
  createdAt: string;
  source: string;
};

export type ApiOverviewStats = {
  projectCount: number;
  projectsByPhase: {
    active: number;
    completed: number;
    paused: number;
    cancelled: number;
  };
  userCount: number;
  conversationCount: number;
  todayActiveUsers: number;
  todayConversations: number;
  documentCount: number;
  auditEventCount: number;
  auditDeletedCount: number;
  pendingReviewCount: number;
};

export type BootstrapPayload = {
  ok: boolean;
  syncedAt: string;
  projects: ApiProject[];
  users: ApiUser[];
  conversations: ApiConversation[];
  projectDocuments: Record<string, ApiProjectDocuments>;
  auditByConversation: Record<string, ApiAuditEntry[]>;
  overview: ApiOverviewStats;
  counts: {
    projects: number;
    users: number;
    conversations: number;
    documents: number;
    auditEvents: number;
  };
};

export async function fetchAdminBootstrap(): Promise<BootstrapPayload> {
  const res = await fetch(`${JFO_API_BASE}/api/admin/bootstrap`, {
    headers: authHeaders(),
  });
  if (res.status === 401) {
    clearAdminSession();
    throw new ApiError("登录已过期，请重新登录", 401);
  }
  const data = await parseJson<BootstrapPayload & { error?: string }>(res);
  if (!res.ok) {
    throw new ApiError(data.error || "加载数据失败", res.status);
  }
  return data;
}
