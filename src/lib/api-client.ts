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

export type ApiTokenDailyRow = {
  date: string;
  input: number;
  output: number;
  total: number;
  cost: number;
};

export type ApiTokenUserRow = {
  userId: string;
  displayName: string;
  orgTitle: string;
  role: string;
  totalTokens: number;
  conversations: number;
  avgPerConv: number;
  lastActive: string;
};

export type ApiTokenRoleGroupRow = {
  label: string;
  totalTokens: number;
  conversations: number;
};

export type ApiTokenUsageStats = {
  periodDays: number;
  monthTotalTokens: number;
  monthEstimatedCost: number;
  meteredEventCount: number;
  estimatedEventCount: number;
  daily: ApiTokenDailyRow[];
  byUser: ApiTokenUserRow[];
  byRoleGroup: ApiTokenRoleGroupRow[];
};

export type ApiProjectCognition = {
  summary: string;
  generatedAt: string;
  model: string | null;
};

export type ApiActiveUserDailyRow = {
  date: string;
  activeUsers: number;
  conversations: number;
};

export type ApiProjectStats = {
  documentCount: number;
  conversationCount: number;
  participantCount: number;
  tokenTotal: number;
  riskLevel: "低" | "中" | "中高" | "高";
};

export type ApiKnowledgeDocument = {
  id: string;
  projectId: string;
  projectName: string;
  filename: string;
  scope: "package" | "session";
  folderLabel: string;
  conversationId: string | null;
  uploadedAt: string;
  uploadedBy: string | null;
  uploadedByName: string | null;
  parseStatus: "已解析" | "解析中" | "待嵌入";
  chunkCount: number;
  embeddedCount: number;
};

export type ApiKnowledgeNetworkRow = {
  projectId: string;
  projectName: string;
  version: number;
  versionLabel: string | null;
  updatedAt: string;
  updatedBy: string;
  updatedByName: string;
  lastJobId: string | null;
  changelog: string | null;
};

export type ApiKnowledgeSummary = {
  documentCount: number;
  parsedCount: number;
  pendingEmbedCount: number;
  knowledgeNetworkCount: number;
  embedModel: string;
  embedDimension: number;
};

export type ApiKnowledgeCatalog = {
  documents: ApiKnowledgeDocument[];
  knowledgeNetworks: ApiKnowledgeNetworkRow[];
  summary: ApiKnowledgeSummary;
};

export type ApiSkillCatalogRow = {
  id: string;
  label: string;
  route: "快答" | "Hermes 深度任务";
  triggerHint: string;
  summary: string;
};

export type ApiAgentJobRow = {
  id: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  conversationId: string | null;
  skillIntent: string;
  skillLabel: string;
  status: string;
  hasKnowledgeNetwork: boolean;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiPermissionRuleRow = {
  role: string;
  label: string;
  capabilities: string[];
};

export type ApiAgentsCatalog = {
  skills: ApiSkillCatalogRow[];
  recentJobs: ApiAgentJobRow[];
  permissionRules: ApiPermissionRuleRow[];
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
  tokenUsage?: ApiTokenUsageStats;
  projectCognition?: Record<string, ApiProjectCognition>;
  activeUserDaily?: ApiActiveUserDailyRow[];
  projectStats?: Record<string, ApiProjectStats>;
  knowledgeCatalog?: ApiKnowledgeCatalog;
  agentsCatalog?: ApiAgentsCatalog;
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

export type ProjectCognitionPayload = {
  ok: boolean;
  projectId: string;
  cached: boolean;
  summary: string | null;
  generatedAt?: string;
  model?: string | null;
  error?: string;
};

export async function fetchProjectCognition(
  projectId: string,
): Promise<ProjectCognitionPayload> {
  const res = await fetch(
    `${JFO_API_BASE}/api/admin/projects/${encodeURIComponent(projectId)}/cognition`,
    { headers: authHeaders() },
  );
  if (res.status === 401) {
    clearAdminSession();
    throw new ApiError("登录已过期，请重新登录", 401);
  }
  const data = await parseJson<ProjectCognitionPayload>(res);
  if (!res.ok) {
    throw new ApiError(data.error || "加载认知摘要失败", res.status);
  }
  return data;
}

export type ApiUserProjectPermission = {
  projectId: string;
  projectName: string;
  accessLabel: string;
  effectiveRole: "admin" | "core" | "mid" | "low" | "guest";
  overrideRole: "admin" | "core" | "mid" | "low" | "guest" | null;
  defaultRole: "admin" | "core" | "mid" | "low" | "guest";
  isCreator: boolean;
  canEdit: boolean;
};

export type AdminUserPermissionsPayload = {
  ok: boolean;
  userId: string;
  displayName: string;
  isPlatformAdmin: boolean;
  projects: ApiUserProjectPermission[];
  error?: string;
};

export async function fetchAdminUserPermissions(
  userId: string,
): Promise<AdminUserPermissionsPayload> {
  const res = await fetch(
    `${JFO_API_BASE}/api/admin/users/${encodeURIComponent(userId)}/permissions`,
    { headers: authHeaders() },
  );
  if (res.status === 401) {
    clearAdminSession();
    throw new ApiError("登录已过期，请重新登录", 401);
  }
  const data = await parseJson<AdminUserPermissionsPayload>(res);
  if (!res.ok) {
    throw new ApiError(data.error || "加载权限失败", res.status);
  }
  return data;
}

export async function updateAdminUserPermissions(
  userId: string,
  updates: { projectId: string; role: "guest" | "low" | "mid" | "core" }[],
): Promise<AdminUserPermissionsPayload> {
  const res = await fetch(
    `${JFO_API_BASE}/api/admin/users/${encodeURIComponent(userId)}/permissions`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ updates }),
    },
  );
  if (res.status === 401) {
    clearAdminSession();
    throw new ApiError("登录已过期，请重新登录", 401);
  }
  const data = await parseJson<AdminUserPermissionsPayload>(res);
  if (!res.ok) {
    throw new ApiError(data.error || "保存权限失败", res.status);
  }
  return data;
}

export async function generateProjectCognition(
  projectId: string,
): Promise<ProjectCognitionPayload> {
  const res = await fetch(
    `${JFO_API_BASE}/api/admin/projects/${encodeURIComponent(projectId)}/cognition`,
    { method: "POST", headers: authHeaders() },
  );
  if (res.status === 401) {
    clearAdminSession();
    throw new ApiError("登录已过期，请重新登录", 401);
  }
  const data = await parseJson<ProjectCognitionPayload>(res);
  if (!res.ok) {
    throw new ApiError(data.error || "生成认知摘要失败", res.status);
  }
  return data;
}
