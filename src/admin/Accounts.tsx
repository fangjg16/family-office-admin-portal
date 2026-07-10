import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  Lock,
  Pencil,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import {
  permissionTableCell,
  type AccountStatus,
  type WorkspaceUser,
} from "@/data/platform";
import { useAdminData } from "@/context/AdminDataContext";
import { cn } from "@/lib/utils";

const AVATAR_RING: Record<string, string> = {
  "candice-guo": "from-[hsl(var(--wine-deep))] to-[hsl(var(--wine-mid))]",
  "jimmy-huang": "from-[hsl(var(--wine))] to-[hsl(var(--terracotta))]",
  "jessica-hu": "from-[hsl(var(--terracotta))] to-[hsl(25_18%_28%)]",
  "jensen-fang": "from-[hsl(34_22%_58%)] to-[hsl(25_18%_32%)]",
  "janice-hi": "from-[hsl(var(--sand))] to-[hsl(35_18%_75%)]",
};

function statusBadgeClass(s: AccountStatus) {
  if (s === "正常")
    return "bg-[hsl(var(--sage)/0.12)] text-[hsl(145_22%_30%)] ring-[hsl(var(--sage)/0.35)]";
  if (s === "冻结") return "bg-red-50 text-red-800 ring-red-200/80";
  return "bg-[hsl(var(--terracotta)/0.12)] text-[hsl(18_28%_32%)] ring-[hsl(var(--terracotta)/0.35)]";
}

function UserDetailModal({
  user,
  projectRows,
  onClose,
}: {
  user: WorkspaceUser;
  projectRows: { projectName: string; accessLabel: string }[];
  onClose: () => void;
}) {

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        aria-label="关闭"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-detail-title"
        className="relative z-10 flex max-h-[min(90vh,680px)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border/80 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
          <h3
            id="user-detail-title"
            className="font-display text-base font-semibold text-foreground"
          >
            用户详情
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-sm",
                AVATAR_RING[user.id] ?? "from-slate-400 to-slate-600"
              )}
            >
              {user.avatarChar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-foreground">
                {user.displayName}
              </div>
              <div className="mt-0.5 shrink-0 font-mono text-xs text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="max-h-[42vh] overflow-y-auto border-t border-border/70">
          <div className="divide-y divide-border/60">
            <div className="flex items-center justify-between gap-2 px-5 py-3 text-sm">
              <span className="text-muted-foreground">手机号</span>
              <span className="font-mono text-foreground">{user.phoneMasked}</span>
            </div>
            <div className="flex items-center justify-between gap-2 px-5 py-3 text-sm">
              <span className="text-muted-foreground">对话数</span>
              <span className="tabular-nums text-foreground">
                {user.conversationCount} 次
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 px-5 py-3 text-sm">
              <span className="text-muted-foreground">登录</span>
              <span className="text-xs text-foreground">{user.lastLogin}</span>
            </div>
            <div className="px-5 py-3">
              <div className="text-xs font-medium text-muted-foreground">
                可见项目
              </div>
              {projectRows.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">暂无可见项目</p>
              ) : (
                <ul className="mt-2 divide-y divide-border/60 overflow-hidden rounded-lg border border-border/70">
                  {projectRows.map((row) => (
                    <li
                      key={row.projectName}
                      className="flex items-start justify-between gap-3 bg-muted/5 px-3 py-2.5 text-sm"
                    >
                      <span className="min-w-0 flex-1 leading-snug text-foreground">
                        {row.projectName}
                      </span>
                      <span className="shrink-0 rounded-md bg-muted/90 px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground">
                        {row.accessLabel}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border/70 bg-muted/20 px-5 py-4">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Pencil className="h-4 w-4" />
            编辑权限
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/60"
          >
            <Eye className="h-4 w-4" />
            查看对话
          </button>
          <button
            type="button"
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 shadow-sm transition hover:bg-red-50"
            aria-label="冻结或锁定账号"
          >
            <Lock className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddUserPlaceholderModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-border/80 bg-white p-5 shadow-xl">
        <h3 className="font-display text-base font-semibold text-foreground">
          新增用户
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          当前为演示环境，新增账号将接入统一身份与邀请流程后在此开通。
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          知道了
        </button>
      </div>
    </div>
  );
}

export function AccountsPage() {
  const { users: workspaceUsers, userProjectAccess, loading } = useAdminData();
  const [detailUser, setDetailUser] = useState<WorkspaceUser | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [query, setQuery] = useState("");
  const closeDetail = useCallback(() => setDetailUser(null), []);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspaceUsers;
    return workspaceUsers.filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [query, workspaceUsers]);

  const countLabel = query.trim()
    ? `${filteredUsers.length} 条匹配`
    : `${workspaceUsers.length} 个账号`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold text-foreground">
            账号与权限
          </h2>
          <span className="rounded-full bg-primary/12 px-2 py-0.5 text-xs font-semibold text-primary">
            {countLabel}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAddUserOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            新增用户
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition hover:bg-muted/60"
          >
            <Download className="h-3.5 w-3.5" />
            导出
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/80 bg-white/90 shadow-sm backdrop-blur-sm">
        <div className="border-b border-border/70 px-4 py-3">
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={2}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索姓名或邮箱…"
              className="w-full rounded-lg border border-border/80 bg-white py-2 pl-9 pr-3 text-sm text-foreground shadow-sm outline-none ring-primary/20 transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading && workspaceUsers.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">加载账号数据…</div>
          ) : (
          <table className="w-full min-w-[1040px] text-sm">
            <thead>
              <tr className="border-b border-border/80">
                <th className="whitespace-nowrap px-3 py-2.5 text-start text-xs font-semibold text-muted-foreground">
                  姓名
                </th>
                <th className="whitespace-nowrap px-3 py-2.5 text-start text-xs font-semibold text-muted-foreground">
                  邮箱
                </th>
                <th className="whitespace-nowrap px-3 py-2.5 text-start text-xs font-semibold text-muted-foreground">
                  组织
                </th>
                <th
                  className="min-w-[8.5rem] max-w-[11rem] px-3 py-2.5 text-start text-xs font-semibold text-muted-foreground"
                  title="全局为 Admin / Guest 时直显；其余按项目分档，请见详情"
                >
                  权限
                </th>
                <th
                  className="whitespace-nowrap px-3 py-2.5 text-start text-xs font-semibold text-muted-foreground"
                  title="可访问项目数"
                >
                  项目
                </th>
                <th className="whitespace-nowrap px-3 py-2.5 text-start text-xs font-semibold text-muted-foreground">
                  最近登录
                </th>
                <th className="whitespace-nowrap px-3 py-2.5 text-start text-xs font-semibold text-muted-foreground">
                  状态
                </th>
                <th className="whitespace-nowrap px-3 py-2.5 text-start text-xs font-semibold text-muted-foreground">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    未找到匹配的姓名或邮箱
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border/60 transition hover:bg-muted/40"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-sm",
                            AVATAR_RING[u.id] ?? "from-slate-400 to-slate-600"
                          )}
                        >
                          {u.avatarChar}
                        </div>
                        <span className="font-medium text-foreground">
                          {u.displayName}
                        </span>
                      </div>
                    </td>
                    <td className="max-w-[14rem] px-3 py-3 font-mono text-xs text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-2 py-0.5 text-xs font-medium text-foreground">
                        <Users className="h-3 w-3 opacity-70" />
                        {u.organization}
                      </span>
                    </td>
                    <td className="max-w-[12rem] px-3 py-3 text-xs leading-snug text-muted-foreground">
                      {permissionTableCell(u.role)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-start text-xs font-normal tabular-nums text-muted-foreground">
                      {u.projectCount}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">
                      {u.lastLogin}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                          statusBadgeClass(u.accountStatus)
                        )}
                      >
                        {u.accountStatus}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <button
                        type="button"
                        onClick={() => setDetailUser(u)}
                        className="text-xs font-normal text-primary transition hover:text-primary/80 hover:underline"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {detailUser && (
        <UserDetailModal
          user={detailUser}
          projectRows={userProjectAccess[detailUser.id] ?? []}
          onClose={closeDetail}
        />
      )}
      {addUserOpen && (
        <AddUserPlaceholderModal onClose={() => setAddUserOpen(false)} />
      )}
    </div>
  );
}
