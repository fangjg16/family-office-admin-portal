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
  type ApiProjectDocuments,
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
  refresh: () => Promise<void>;
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
      refresh,
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
      refresh,
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
