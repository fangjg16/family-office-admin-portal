/**
 * 与 family-office-platform 工作台保持一致的业务数据（静态副本，供管理后台独立运行）。
 * 项目列表同步自生产 D1：https://jfo-api.jfo-api.workers.dev/api/projects
 * 最后同步：2026-06-29（已排除「测试新建项目」等联调占位项）
 */

export type ProjectPhase =
  | "Active（资源筹备中）"
  | "Completed（已签约）"
  | "Paused（暂停）"
  | "Cancelled（已取消）";

export type WorkspaceProject = {
  id: string;
  name: string;
  category: string;
  phase: ProjectPhase;
  summary: string;
  guestSummary: string;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export const ALL_PROJECTS: WorkspaceProject[] = [
  {
    id: "proj-87c4b0718f58",
    name: "PET 源天生物",
    category: "未分类",
    phase: "Active（资源筹备中）",
    summary: "PET塑料酶法再生及产业化",
    guestSummary: "PET塑料酶法再生及产业化",
    createdBy: "jensen-fang",
    createdAt: "2026-06-04T08:10:52.906Z",
    updatedAt: "2026-06-26T06:38:11.857Z",
  },
  {
    id: "proj-4a974e67c0f9",
    name: "演员AI版权投资",
    category: "演员IP授权 × 影视制作",
    phase: "Active（资源筹备中）",
    summary:
      "通过签约具备一定商业价值又有授权意愿的艺人，获得其AI肖像、声音、表演风格、形象使用权，并将其应用于AI短剧制片等场景。",
    guestSummary: "AI短剧及演员AI版权 项目在管推进中，详情按权限展示。",
    createdBy: "jessica-hu",
    createdAt: "2026-06-15T02:31:43.637Z",
    updatedAt: "2026-06-25T07:23:22.940Z",
  },
  {
    id: "proj-535a240acf88",
    name: "多肽产品中澳供应链",
    category: "Biotech",
    phase: "Active（资源筹备中）",
    summary:
      "拟整合中国大型多肽生产商、澳大利亚配置药房及全球销售渠道，建立多肽产品跨境合规化供应链。",
    guestSummary:
      "拟整合中国大型多肽生产商、澳大利亚配置药房及全球销售渠道，建立多肽产品跨境合规化供应链。",
    createdBy: "jessica-hu",
    createdAt: "2026-05-29T08:47:49.265Z",
    updatedAt: "2026-06-18T02:29:08.819Z",
  },
  {
    id: "proj-7c0f947a6a00",
    name: "中国-中亚易货贸易",
    category: "International Trade",
    phase: "Active（资源筹备中）",
    summary:
      "一个利用中国与中亚地区间政府批准的易货贸易配额体制、在霍尔果斯自贸区实现免货币结算商品互换的贸易运营机会。",
    guestSummary:
      "一个利用中国与中亚地区国家间政府批准的易货贸易配额体制、在霍尔果斯自贸区实现免货币结算商品互换的贸易运营机会。",
    createdBy: "jensen-fang",
    createdAt: "2026-05-27T03:27:56.146Z",
    updatedAt: "2026-06-04T03:39:33.827Z",
  },
];

export const TOTAL_PROJECT_COUNT = ALL_PROJECTS.length;

export type WorkspaceRole =
  | "admin"
  | "core"
  | "mid"
  | "low"
  | "guest";

export type AccountStatus = "正常" | "冻结" | "待激活";

export type WorkspaceUser = {
  id: string;
  displayName: string;
  orgTitle: string;
  avatarChar: string;
  email: string;
  organization: string;
  role: WorkspaceRole;
  projectCount: number;
  lastLogin: string;
  accountStatus: AccountStatus;
  /** 脱敏手机号，供详情展示 */
  phoneMasked: string;
  /** 累计对话次数（演示） */
  conversationCount: number;
};

/** 详情弹窗内权限层级标签（与角色对应） */
export function permissionTierLabel(role: WorkspaceRole): string {
  switch (role) {
    case "admin":
      return "A级权限";
    case "core":
      return "B级权限";
    case "mid":
      return "C级权限";
    case "low":
    case "guest":
    default:
      return "D级权限";
  }
}

export const WORKSPACE_USERS: WorkspaceUser[] = [
  {
    id: "candice-guo",
    displayName: "CandiceGuo",
    orgTitle: "合域 · Admin",
    avatarChar: "C",
    email: "candice.guo@jfo.ai",
    organization: "合域",
    role: "admin",
    projectCount: 4,
    lastLogin: "2026-04-14 09:18",
    accountStatus: "正常",
    phoneMasked: "138****1028",
    conversationCount: 156,
  },
  {
    id: "jimmy-huang",
    displayName: "JimmyHuang",
    orgTitle: "家族办公室 · Core 核心级",
    avatarChar: "J",
    email: "jimmy.huang@jfo.ai",
    organization: "家族办公室",
    role: "core",
    projectCount: 4,
    lastLogin: "2026-04-14 08:42",
    accountStatus: "正常",
    phoneMasked: "139****5512",
    conversationCount: 89,
  },
  {
    id: "jessica-hu",
    displayName: "JessicaHu",
    orgTitle: "投资顾问 · Advanced 进阶级",
    avatarChar: "S",
    email: "jessica.hu@jfo.ai",
    organization: "投资顾问",
    role: "mid",
    projectCount: 4,
    lastLogin: "2026-04-13 21:05",
    accountStatus: "正常",
    phoneMasked: "136****9031",
    conversationCount: 64,
  },
  {
    id: "jensen-fang",
    displayName: "JensenFang",
    orgTitle: "研究部 · Basic 基础级",
    avatarChar: "N",
    email: "jensen.fang@jfo.ai",
    organization: "研究部",
    role: "low",
    projectCount: 4,
    lastLogin: "2026-04-12 16:30",
    accountStatus: "正常",
    phoneMasked: "137****2460",
    conversationCount: 23,
  },
  {
    id: "janice-hi",
    displayName: "JaniceHi",
    orgTitle: "访客 · Guest",
    avatarChar: "J",
    email: "janice.hi@jfo.ai",
    organization: "访客",
    role: "guest",
    projectCount: 0,
    lastLogin: "2026-04-11 14:22",
    accountStatus: "正常",
    phoneMasked: "—",
    conversationCount: 0,
  },
];

/** 工作台访问说明（展示用） */
export const MOCK_PASSWORD_HINT = "工作台密码：jfo2026";

export const ROLE_LABEL: Record<WorkspaceRole, string> = {
  admin: "Admin",
  core: "Core 核心级",
  mid: "Advanced 进阶级",
  low: "Basic 基础级",
  guest: "Guest",
};

/** 项目权限列 / 对话监控档位展示（与主平台 roleLabelForProject 一致） */
export function roleLabelForWorkspaceRole(role: WorkspaceRole): string {
  return ROLE_LABEL[role];
}

export function projectAccessDisplayLabel(accessLabel: string): string {
  const map: Record<string, string> = {
    Admin: "Admin",
    Core: "Core 核心级",
    Mid: "Advanced 进阶级",
    Low: "Basic 基础级",
    Guest: "Guest",
  };
  return map[accessLabel] ?? accessLabel;
}

/** 某用户在某项目下的对话权限档位 */
export function conversationTierForProject(
  userId: string,
  projectName: string
): string {
  const rows = USER_PROJECT_ACCESS[userId];
  const row = rows?.find((r) => r.projectName === projectName);
  if (row) return projectAccessDisplayLabel(row.accessLabel);
  const u = WORKSPACE_USERS.find((x) => x.id === userId);
  return u ? roleLabelForWorkspaceRole(u.role) : "—";
}

/** 对话监控用户列副标题：仅组织（档位见「档位」列） */
export function conversationUserOrganization(userId: string): string {
  const u = WORKSPACE_USERS.find((x) => x.id === userId);
  return u?.organization ?? "—";
}

/** 各账号在项目上的权限摘要（与 platform 逻辑一致，供后台展示） */
export const USER_ROLE_SUMMARY: Record<string, string> = {
  "candice-guo": "Admin · 全项目最高权限",
  "jimmy-huang":
    "Core 为主；覆盖 PET 源天生物、多肽供应链、演员 AI 版权、中亚易货贸易等云端项目",
  "jessica-hu":
    "Mid 为主；多肽产品中澳供应链、演员 AI 版权为创建人 Admin 档，其余项目为 Mid",
  "jensen-fang":
    "Low 为默认档；PET 源天生物、中国-中亚易货贸易为创建人可 Core 档，其余为 Mid",
  "janice-hi": "Guest · 全项目访客（不可进入项目对话）",
};

/** 各账号在可见项目上的权限（与详情弹窗列表一致） */
export type UserProjectAccessRow = {
  projectName: string;
  /** 在该项目下的权限档位 */
  accessLabel: string;
};

const JIMMY_PROJECT_ACCESS: readonly string[] = ["Core", "Core", "Core", "Core"];
const JESSICA_PROJECT_ACCESS: readonly string[] = ["Mid", "Admin", "Admin", "Mid"];
const JENSEN_PROJECT_ACCESS: readonly string[] = ["Core", "Mid", "Mid", "Core"];

export const USER_PROJECT_ACCESS: Record<string, UserProjectAccessRow[]> = {
  "candice-guo": ALL_PROJECTS.map((p) => ({
    projectName: p.name,
    accessLabel: "Admin",
  })),
  "jimmy-huang": ALL_PROJECTS.map((p, i) => ({
    projectName: p.name,
    accessLabel: JIMMY_PROJECT_ACCESS[i] ?? "Core",
  })),
  "jessica-hu": ALL_PROJECTS.map((p, i) => ({
    projectName: p.name,
    accessLabel: JESSICA_PROJECT_ACCESS[i] ?? "Mid",
  })),
  "jensen-fang": ALL_PROJECTS.map((p, i) => ({
    projectName: p.name,
    accessLabel: JENSEN_PROJECT_ACCESS[i] ?? "Low",
  })),
  "janice-hi": [],
};

/** 列表「权限」列：仅全局 Admin / Guest 直显；其余引导至详情 */
export function permissionTableCell(role: WorkspaceRole): string {
  if (role === "admin") return ROLE_LABEL.admin;
  if (role === "guest") return ROLE_LABEL.guest;
  return "各项目权限见详情";
}
