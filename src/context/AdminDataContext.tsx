import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchAdminBootstrap,
  type ApiAuditEntry,
  type ApiConversation,
  type ApiOverviewStats,
  type ApiProject,
  type ApiKnowledgeCatalog,
  type ApiAgentsCatalog,
  type ApiProjectCognition,
  type ApiProjectDocuments,
  type ApiProjectStats,
  type ApiActiveUserDailyRow,
  type ApiTokenUsageStats,
  type ApiUser,
} from "@/lib/api-client";
import { loadAdminToken } from "@/lib/admin-session";
import type { WorkspaceProject, WorkspaceRole, WorkspaceUser } from "@/data/platform";
import type { ConversationRow } from "@/data/conversations-mock";

const EMPTY_OVERVIEW: ApiOverviewStats = {
  projectCount: 0,
  projectsByPhase: { active: 0, completed: 0, paused: 0, cancelled: 0 },
  userCount: 0,
  conversationCount: 0,
  todayActiveUsers: 0,
  todayConversations: 0,
  documentCount: 0,
  auditEventCount: 0,
  auditDeletedCount: 0,
  pendingReviewCount: 0,
};

const EMPTY_TOKEN_USAGE: ApiTokenUsageStats = {
  periodDays: 30,
  monthTotalTokens: 0,
  monthEstimatedCost: 0,
  meteredEventCount: 0,
  estimatedEventCount: 0,
  daily: [],
  byUser: [],
  byRoleGroup: [],
};

const EMPTY_KNOWLEDGE: ApiKnowledgeCatalog = {
  documents: [],
  knowledgeNetworks: [],
  summary: {
    documentCount: 0,
    parsedCount: 0,
    pendingEmbedCount: 0,
    knowledgeNetworkCount: 0,
    embedModel: "text-embedding-v4",
    embedDimension: 1024,
  },
};

const EMPTY_AGENTS: ApiAgentsCatalog = {
  skills: [],
  recentJobs: [],
  permissionRules: [],
};

type AdminDataContextValue = {
  loading: boolean;
  error: string | null;
  syncedAt: string | null;
  projects: WorkspaceProject[];
  users: WorkspaceUser[];
  userProjectAccess: Record<string, { projectName: string; accessLabel: string }[]>;
  conversations: ConversationRow[];
  projectDocuments: Record<string, ApiProjectDocuments>;
  auditByConversation: Record<string, ApiAuditEntry[]>;
  overview: ApiOverviewStats;
  tokenUsage: ApiTokenUsageStats;
  projectCognition: Record<string, ApiProjectCognition>;
  activeUserDaily: ApiActiveUserDailyRow[];
  projectStats: Record<string, ApiProjectStats>;
  knowledgeCatalog: ApiKnowledgeCatalog;
  agentsCatalog: ApiAgentsCatalog;
  refresh: () => Promise<void>;
  updateProjectCognition: (projectId: string, entry: ApiProjectCognition) => void;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

function mapProject(p: ApiProject): WorkspaceProject {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    phase: p.phase as WorkspaceProject["phase"],
    summary: p.summary,
    guestSummary: p.guestSummary,
    createdBy: p.createdBy,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function mapUser(u: ApiUser): WorkspaceUser {
  return {
    id: u.id,
    displayName: u.displayName,
    orgTitle: u.orgTitle,
    avatarChar: u.avatarChar,
    email: u.email,
    organization: u.organization,
    role: u.role as WorkspaceRole,
    projectCount: u.projectCount,
    lastLogin: u.lastLogin,
    accountStatus: u.accountStatus,
    phoneMasked: u.phoneMasked,
    conversationCount: u.conversationCount,
  };
}

function mapConversation(c: ApiConversation): ConversationRow {
  return {
    ...c,
    roleTier: c.roleTier as ConversationRow["roleTier"],
  };
}

function buildUserProjectAccess(users: ApiUser[]) {
  const map: Record<string, { projectName: string; accessLabel: string }[]> = {};
  for (const u of users) {
    map[u.id] = u.projectAccess.map((row) => ({
      projectName: row.projectName,
      accessLabel: row.accessLabel,
    }));
  }
  return map;
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [users, setUsers] = useState<WorkspaceUser[]>([]);
  const [userProjectAccess, setUserProjectAccess] = useState<
    Record<string, { projectName: string; accessLabel: string }[]>
  >({});
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [projectDocuments, setProjectDocuments] = useState<
    Record<string, ApiProjectDocuments>
  >({});
  const [auditByConversation, setAuditByConversation] = useState<
    Record<string, ApiAuditEntry[]>
  >({});
  const [overview, setOverview] = useState<ApiOverviewStats>(EMPTY_OVERVIEW);
  const [tokenUsage, setTokenUsage] = useState<ApiTokenUsageStats>(EMPTY_TOKEN_USAGE);
  const [projectCognition, setProjectCognition] = useState<
    Record<string, ApiProjectCognition>
  >({});
  const [activeUserDaily, setActiveUserDaily] = useState<ApiActiveUserDailyRow[]>(
    [],
  );
  const [projectStats, setProjectStats] = useState<Record<string, ApiProjectStats>>(
    {},
  );
  const [knowledgeCatalog, setKnowledgeCatalog] =
    useState<ApiKnowledgeCatalog>(EMPTY_KNOWLEDGE);
  const [agentsCatalog, setAgentsCatalog] = useState<ApiAgentsCatalog>(EMPTY_AGENTS);

  const updateProjectCognition = useCallback(
    (projectId: string, entry: ApiProjectCognition) => {
      setProjectCognition((prev) => ({ ...prev, [projectId]: entry }));
    },
    [],
  );

  const refresh = useCallback(async () => {
    if (!loadAdminToken()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminBootstrap();
      setSyncedAt(data.syncedAt);
      setProjects(data.projects.map(mapProject));
      setUsers(data.users.map(mapUser));
      setUserProjectAccess(buildUserProjectAccess(data.users));
      setConversations(data.conversations.map(mapConversation));
      setProjectDocuments(data.projectDocuments ?? {});
      setAuditByConversation(data.auditByConversation ?? {});
      setOverview(data.overview ?? EMPTY_OVERVIEW);
      setTokenUsage(data.tokenUsage ?? EMPTY_TOKEN_USAGE);
      setProjectCognition(data.projectCognition ?? {});
      setActiveUserDaily(data.activeUserDaily ?? []);
      setProjectStats(data.projectStats ?? {});
      setKnowledgeCatalog(data.knowledgeCatalog ?? EMPTY_KNOWLEDGE);
      setAgentsCatalog(data.agentsCatalog ?? EMPTY_AGENTS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      loading,
      error,
      syncedAt,
      projects,
      users,
      userProjectAccess,
      conversations,
      projectDocuments,
      auditByConversation,
      overview,
      tokenUsage,
      projectCognition,
      activeUserDaily,
      projectStats,
      knowledgeCatalog,
      agentsCatalog,
      refresh,
      updateProjectCognition,
    }),
    [
      loading,
      error,
      syncedAt,
      projects,
      users,
      userProjectAccess,
      conversations,
      projectDocuments,
      auditByConversation,
      overview,
      tokenUsage,
      projectCognition,
      activeUserDaily,
      projectStats,
      knowledgeCatalog,
      agentsCatalog,
      refresh,
      updateProjectCognition,
    ],
  );

  return (
    <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
  );
}

export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
