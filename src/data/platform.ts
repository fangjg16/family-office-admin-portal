/**
 * 与 family-office-platform 工作台保持一致的业务数据（静态副本，供管理后台独立运行）。
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
};

export const ALL_PROJECTS: WorkspaceProject[] = [
  {
    id: "shrimp",
    name: "白虾供应链联合投资",
    category: "食品农业",
    phase: "Active（资源筹备中）",
    summary:
      "厄瓜多尔白虾 FOB + 华东冷链；华南资本 3,000 万已确认，远东集团 4,000 万意向函在途。",
    guestSummary:
      "南美对虾跨境供应链，多路资金与冷链环节对齐中，详情按权限展开。",
  },
  {
    id: "natgeo-rwa",
    name: "国家地理濒危物种 IP 数字货币项目",
    category: "数字资产 / IP",
    phase: "Active（资源筹备中）",
    summary:
      "民生系高层对接国家地理 IP；濒危动植物主题数字发行预计总盘子数亿元，发行结构与授权边界进入法务与合规联审。",
    guestSummary:
      "文化 IP 与数字发行项目已立项推进，资金与合规路径按权限展示。",
  },
  {
    id: "europe-hotel-ma",
    name: "欧洲精品酒店收购",
    category: "酒店 / 旅游",
    phase: "Active（资源筹备中）",
    summary:
      "南欧精品酒店组合收购已纳入并购管线；标的清单与估值模型随尽调推进持续更新。",
    guestSummary:
      "欧洲酒店类资产项目在管推进中，具体国家与交易结构按权限展示。",
  },
  {
    id: "coastal-estate",
    name: "滨海城市更新地产基金",
    category: "地产",
    phase: "Active（资源筹备中）",
    summary:
      "滨海核心区旧改 SPV；评估约 2.6 亿，海通资管劣后意向 1.1–1.3 亿条款谈判中。",
    guestSummary:
      "城市更新类持有资产，配资与征拆双线推进，详情按权限展开。",
  },
  {
    id: "cross-trade",
    name: "跨境大宗贸易周转",
    category: "贸易",
    phase: "Active（资源筹备中）",
    summary:
      "南美大豆 + 棕榈油 LC 周转；本期信用证约 ¥1.18 亿，在途三笔、一批待补检验。",
    guestSummary:
      "跨境大宗信用证与在途货权结构，单证与授信按权限展示。",
  },
  {
    id: "digital-portal",
    name: "家族数字化门户",
    category: "数字化",
    phase: "Paused（暂停）",
    summary:
      "门户一期未达验收；神州数码实施 + 阿里云，合同 ¥280 万已付 30%，等保测评换签重提。",
    guestSummary:
      "家族统一门户与安全评审暂停，恢复时间视测评结论而定。",
  },
  {
    id: "ip-invest",
    name: "文娱 IP 投资联合体",
    category: "文娱 / IP",
    phase: "Cancelled（已取消）",
    summary:
      "主投视频平台书面终止；已付定金 ¥800 万进入仲裁，项目侧不再承接新业务。",
    guestSummary:
      "文娱 IP 联合投资已终止，历史材料仅供内部审计追溯。",
  },
  {
    id: "hk-us-equity",
    name: "港美二级市场专户",
    category: "证券",
    phase: "Active（资源筹备中）",
    summary:
      "中行（香港）托管 + 华泰/IB；港美组合约 ¥2.05 亿等值，近期波动率预警已处理。",
    guestSummary:
      "港美多资产专户，持仓与策略细节按权限与合规要求展示。",
  },
  {
    id: "energy-ma",
    name: "新能源并购储备池",
    category: "能源",
    phase: "Completed（已签约）",
    summary:
      "苏北 120MW 地面电站已签约；产业方 2 亿对赌发电量，已并网 78MW，补贴目录申报中。",
    guestSummary:
      "新能源电站并购已进入投后，并网与补贴进度按权限展示。",
  },
  {
    id: "med-channel",
    name: "医疗器械渠道整合",
    category: "医疗",
    phase: "Active（资源筹备中）",
    summary:
      "华东经销 + 微创心脉区域总代；进院 42 家，集采降价压力下重算渠道毛利。",
    guestSummary:
      "医疗器械渠道整合，进院与集采进度按权限展示。",
  },
  {
    id: "offshore-trust",
    name: "离岸信托架构优化",
    category: "法务 / 架构",
    phase: "Active（资源筹备中）",
    summary:
      "BVI Ocean Ridge + 香港中间层；CRS 与经济实质材料补档，受益分配触发待法审闭合。",
    guestSummary:
      "离岸控股与信托层优化，受益人及路径信息高度敏感、按权限展示。",
  },
  {
    id: "edu-ma",
    name: "职业教育资产并购",
    category: "教育",
    phase: "Active（资源筹备中）",
    summary:
      "华东职教集团 E 估值约 3.5 亿；并购基金意向 1.5 亿，地方国资 8,000 万混改谈判中。",
    guestSummary:
      "职业教育标的并购与混改配套，尽调与对赌条款按权限展示。",
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
    projectCount: 12,
    lastLogin: "2026-04-14 09:18",
    accountStatus: "正常",
    phoneMasked: "138****1028",
    conversationCount: 156,
  },
  {
    id: "jimmy-huang",
    displayName: "JimmyHuang",
    orgTitle: "家族办公室 · Core",
    avatarChar: "J",
    email: "jimmy.huang@jfo.ai",
    organization: "家族办公室",
    role: "core",
    projectCount: 9,
    lastLogin: "2026-04-14 08:42",
    accountStatus: "正常",
    phoneMasked: "139****5512",
    conversationCount: 89,
  },
  {
    id: "jessica-hu",
    displayName: "JessicaHu",
    orgTitle: "投资顾问 · Mid",
    avatarChar: "S",
    email: "jessica.hu@jfo.ai",
    organization: "投资顾问",
    role: "mid",
    projectCount: 8,
    lastLogin: "2026-04-13 21:05",
    accountStatus: "正常",
    phoneMasked: "136****9031",
    conversationCount: 64,
  },
  {
    id: "jensen-fang",
    displayName: "JensenFang",
    orgTitle: "研究部 · Low",
    avatarChar: "N",
    email: "jensen.fang@jfo.ai",
    organization: "研究部",
    role: "low",
    projectCount: 6,
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
  core: "Core（核心级）",
  mid: "Mid",
  low: "Low",
  guest: "Guest",
};

/** 各账号在项目上的权限摘要（与 platform 逻辑一致，供后台展示） */
export const USER_ROLE_SUMMARY: Record<string, string> = {
  "candice-guo": "Admin · 全项目最高权限",
  "jimmy-huang":
    "Core 为主；文娱 IP 项目为 Mid；核心项目含白虾、国家地理 IP、离岸信托等",
  "jessica-hu":
    "Mid 为主；数字化门户 / 文娱 IP / 职业教育为 Core；大宗贸易为 Low",
  "jensen-fang":
    "Low 为默认档；白虾为 Core；港美专户与新能源、医疗渠道等为 Mid",
  "janice-hi": "Guest · 全项目访客（不可进入项目对话）",
};

/** 各账号在可见项目上的权限（与详情弹窗列表一致） */
export type UserProjectAccessRow = {
  projectName: string;
  /** 在该项目下的权限档位 */
  accessLabel: string;
};

const JIMMY_PROJECT_ACCESS: readonly string[] = [
  "Core",
  "Core",
  "Core",
  "Core",
  "Core",
  "Mid",
  "Mid",
  "Mid",
  "Core",
];
const JESSICA_PROJECT_ACCESS: readonly string[] = [
  "Mid",
  "Mid",
  "Core",
  "Core",
  "Mid",
  "Low",
  "Mid",
  "Mid",
];
const JENSEN_PROJECT_ACCESS: readonly string[] = [
  "Low",
  "Core",
  "Mid",
  "Mid",
  "Mid",
  "Low",
];

export const USER_PROJECT_ACCESS: Record<string, UserProjectAccessRow[]> = {
  "candice-guo": ALL_PROJECTS.map((p) => ({
    projectName: p.name,
    accessLabel: "Admin",
  })),
  "jimmy-huang": ALL_PROJECTS.slice(0, 9).map((p, i) => ({
    projectName: p.name,
    accessLabel: JIMMY_PROJECT_ACCESS[i] ?? "Core",
  })),
  "jessica-hu": ALL_PROJECTS.slice(0, 8).map((p, i) => ({
    projectName: p.name,
    accessLabel: JESSICA_PROJECT_ACCESS[i] ?? "Mid",
  })),
  "jensen-fang": ALL_PROJECTS.slice(0, 6).map((p, i) => ({
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
