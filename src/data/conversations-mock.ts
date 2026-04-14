/**
 * 对话监控演示数据：生命周期队列 + 策略命中 + 会话时间线（模拟）
 */

export type RiskLevel = "正常" | "提示" | "关注" | "拦截";

export type ConvTurn = {
  role: "user" | "assistant";
  content: string;
  time: string;
};

/** 运营视角队列状态（与风险、导出正交，便于列表分栏） */
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
  /** 本轮会话工具调用（演示） */
  toolsInvoked: string[];
  /** 检索命中知识库片段数（演示） */
  kbCitations: number;
  /** 会话节选：多轮对话，便于详情区「时间线」呈现 */
  turns: ConvTurn[];
};

export const CONVERSATIONS: ConversationRow[] = [
  {
    id: "cv-101",
    sessionId: "sess_7f2a9c",
    projectId: "shrimp",
    projectName: "白虾供应链联合投资",
    userId: "jimmy-huang",
    userName: "JimmyHuang",
    userOrg: "家族办公室 · Core",
    roleTier: "Core",
    startedAt: "2026-04-14 09:12",
    lastActiveAt: "2026-04-14 10:41",
    messages: 34,
    tokensEst: 128400,
    risk: "正常",
    policyHits: [],
    lastIntent: "核对远东集团意向函条款与交割前提",
    lastSnippet:
      "请把「意向函」里关于**装运港检验**与**付款节点**的两段原文对比上周版本，标出差异…",
    exported: false,
    channel: "项目对话",
    lifecycleQueue: "对话跟进中",
    toolsInvoked: ["retrieve_kb", "compare_diff"],
    kbCitations: 6,
    turns: [
      {
        role: "user",
        time: "09:12",
        content:
          "请把「意向函」里关于装运港检验与付款节点的两段原文对比上周版本，标出差异。",
      },
      {
        role: "assistant",
        time: "09:13",
        content:
          "已从知识库 `kd-001` 抽取两版对应段落。差异 3 处：①检验机构表述；②付款节点 D+5 调整为 D+7；③仲裁地由新加坡改为香港。是否生成对照表？",
      },
      {
        role: "user",
        time: "09:18",
        content: "生成对照表，并标注对授信银行保函的影响。",
      },
      {
        role: "assistant",
        time: "09:19",
        content:
          "已生成对照表（内部）。对保函影响：仅②触发保函生效日重算；①③为商业条款，不影响保函格式。",
      },
    ],
  },
  {
    id: "cv-102",
    sessionId: "sess_3b81d0",
    projectId: "natgeo-rwa",
    projectName: "国家地理濒危物种 IP 数字货币项目",
    userId: "candice-guo",
    userName: "CandiceGuo",
    userOrg: "合域 · Admin",
    roleTier: "Admin",
    startedAt: "2026-04-14 08:05",
    lastActiveAt: "2026-04-14 10:38",
    messages: 52,
    tokensEst: 201200,
    risk: "提示",
    policyHits: ["提及具体监管口径（未标注来源）"],
    lastIntent: "梳理发行结构与授权边界问答口径",
    lastSnippet:
      "如果监管问询聚焦在**二级流通**，我们需要一套对外的**统一表述**，请生成三版话术并标注依据…",
    exported: true,
    channel: "项目对话",
    lifecycleQueue: "待合规复核",
    toolsInvoked: ["retrieve_kb", "draft_talking_points"],
    kbCitations: 4,
    turns: [
      {
        role: "user",
        time: "08:05",
        content:
          "生成三版对外话术：监管若问二级流通，我们如何统一表述？每版标注依据来源。",
      },
      {
        role: "assistant",
        time: "08:07",
        content:
          "已生成三版草案（内部）。依据已引用 `kd-002` 授权条款与附件；**提示**：有一处监管口径引用未标注公开文件编号，已标记为待补充。",
      },
      {
        role: "user",
        time: "08:20",
        content: "把未标注来源的句子单独列出来，我交给法务补链接。",
      },
      {
        role: "assistant",
        time: "08:21",
        content:
          "已列出 2 句待补充来源；建议同步至合规复核队列。",
      },
    ],
  },
  {
    id: "cv-103",
    sessionId: "sess_9e44ab",
    projectId: "hk-us-equity",
    projectName: "港美二级市场专户",
    userId: "jensen-fang",
    userName: "JensenFang",
    userOrg: "研究部 · Low",
    roleTier: "Low",
    startedAt: "2026-04-13 16:22",
    lastActiveAt: "2026-04-14 09:55",
    messages: 61,
    tokensEst: 98200,
    risk: "正常",
    policyHits: [],
    lastIntent: "解释波动率预警触发条件与复盘",
    lastSnippet:
      "请用**非投资建议**口径，说明昨日预警触发时组合的行业暴露与对冲状态…",
    exported: false,
    channel: "项目对话",
    lifecycleQueue: "对话跟进中",
    toolsInvoked: ["retrieve_portfolio_summary", "explain_risk"],
    kbCitations: 2,
    turns: [
      {
        role: "user",
        time: "16:22",
        content:
          "用非投资建议口径，说明昨日预警触发时行业暴露与对冲状态。",
      },
      {
        role: "assistant",
        time: "16:24",
        content:
          "以下为教育性说明：昨日预警与组合波动率阈值触发相关；行业暴露为××（脱敏）。不构成投资建议。",
      },
    ],
  },
  {
    id: "cv-104",
    sessionId: "sess_2c10ff",
    projectId: "offshore-trust",
    projectName: "离岸信托架构优化",
    userId: "jimmy-huang",
    userName: "JimmyHuang",
    userOrg: "家族办公室 · Core",
    roleTier: "Core",
    startedAt: "2026-04-13 11:40",
    lastActiveAt: "2026-04-13 18:06",
    messages: 28,
    tokensEst: 87400,
    risk: "关注",
    policyHits: ["疑似完整身份证号片段（已自动遮罩）", "受益人路径细节"],
    lastIntent: "受益分配触发条件与文件清单",
    lastSnippet:
      "我需要一份**受益分配**触发条件的检查清单，并标注哪些材料必须走法审…",
    exported: true,
    channel: "项目对话",
    lifecycleQueue: "待合规复核",
    toolsInvoked: ["retrieve_kb", "checklist"],
    kbCitations: 5,
    turns: [
      {
        role: "user",
        time: "11:40",
        content:
          "给我受益分配触发条件检查清单，并标注哪些材料必须走法审。",
      },
      {
        role: "assistant",
        time: "11:42",
        content:
          "已生成清单（内部）。检测到用户粘贴中包含疑似证件号片段，已自动遮罩；建议走法审的材料已标「法审」。",
      },
    ],
  },
  {
    id: "cv-105",
    sessionId: "sess_d901ae",
    projectId: "cross-trade",
    projectName: "跨境大宗贸易周转",
    userId: "jessica-hu",
    userName: "JessicaHu",
    userOrg: "投资顾问 · Mid",
    roleTier: "Mid",
    startedAt: "2026-04-12 14:18",
    lastActiveAt: "2026-04-12 17:42",
    messages: 19,
    tokensEst: 51200,
    risk: "正常",
    policyHits: [],
    lastIntent: "信用证单据不符点处理流程",
    lastSnippet:
      "请按**在途三笔**的最新状态，列出银行可能提出的不符点与补救动作…",
    exported: false,
    channel: "项目对话",
    lifecycleQueue: "已归档",
    toolsInvoked: ["retrieve_kb", "workflow_steps"],
    kbCitations: 7,
    turns: [
      {
        role: "user",
        time: "14:18",
        content: "在途三笔 LC，列出可能不符点与补救动作。",
      },
      {
        role: "assistant",
        time: "14:20",
        content:
          "已按 `kd-007` 单证样本与在途状态生成流程表；不符点类型以银行常见口径归纳。",
      },
    ],
  },
  {
    id: "cv-106",
    sessionId: "sess_5512cc",
    projectId: "digital-portal",
    projectName: "家族数字化门户",
    userId: "jessica-hu",
    userName: "JessicaHu",
    userOrg: "投资顾问 · Mid",
    roleTier: "Mid",
    startedAt: "2026-04-11 10:02",
    lastActiveAt: "2026-04-11 10:45",
    messages: 12,
    tokensEst: 22800,
    risk: "拦截",
    policyHits: ["等保测评未闭合：禁止输出可部署配置", "尝试索取生产密钥"],
    lastIntent: "生成阿里云安全组规则（生产环境）",
    lastSnippet:
      "请直接给我**生产环境**安全组入站规则，我要贴到控制台…",
    exported: true,
    channel: "项目对话",
    lifecycleQueue: "待合规复核",
    toolsInvoked: ["blocked"],
    kbCitations: 0,
    turns: [
      {
        role: "user",
        time: "10:02",
        content: "直接给我生产环境安全组入站规则，我要贴到控制台。",
      },
      {
        role: "assistant",
        time: "10:02",
        content:
          "已拦截：等保测评未闭合，禁止输出可部署生产配置。可提供检查清单与测试环境示例。",
      },
    ],
  },
  {
    id: "cv-107",
    sessionId: "sess_88aa01",
    projectId: "energy-ma",
    projectName: "新能源并购储备池",
    userId: "jensen-fang",
    userName: "JensenFang",
    userOrg: "研究部 · Low",
    roleTier: "Low",
    startedAt: "2026-04-10 09:30",
    lastActiveAt: "2026-04-10 11:12",
    messages: 22,
    tokensEst: 44100,
    risk: "提示",
    policyHits: ["请求超出该角色可见粒度的补贴金额细节"],
    lastIntent: "补贴目录申报进度与风险点",
    lastSnippet:
      "补贴目录申报里，**中央财政**与**地方财政**的口径差异会影响模型吗…",
    exported: false,
    channel: "项目对话",
    lifecycleQueue: "对话跟进中",
    toolsInvoked: ["retrieve_kb", "role_guard"],
    kbCitations: 3,
    turns: [
      {
        role: "user",
        time: "09:30",
        content:
          "请给出补贴目录申报里中央与地方财政口径差异对模型的影响，并给出具体金额区间。",
      },
      {
        role: "assistant",
        time: "09:31",
        content:
          "口径差异会影响模型假设；**具体金额区间**超出您当前角色可见范围，已仅输出结构化风险点与需升级路径。",
      },
    ],
  },
  {
    id: "cv-108",
    sessionId: "sess_4d22ef",
    projectId: "shrimp",
    projectName: "白虾供应链联合投资",
    userId: "janice-hi",
    userName: "JaniceHi",
    userOrg: "访客 · Guest",
    roleTier: "Guest",
    startedAt: "2026-04-09 15:00",
    lastActiveAt: "2026-04-09 15:04",
    messages: 3,
    tokensEst: 2100,
    risk: "拦截",
    policyHits: ["Guest 禁止进入项目对话（会话已自动结束）"],
    lastIntent: "—",
    lastSnippet: "系统提示：当前账号无权进入项目对话区。",
    exported: false,
    channel: "项目对话",
    lifecycleQueue: "已归档",
    toolsInvoked: ["access_control"],
    kbCitations: 0,
    turns: [
      {
        role: "user",
        time: "15:00",
        content: "打开白虾项目对话并总结尽调。",
      },
      {
        role: "assistant",
        time: "15:00",
        content:
          "当前账号为 Guest，无权进入项目对话区；会话已结束。",
      },
    ],
  },
];

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
