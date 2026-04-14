/**
 * 知识库演示数据：树层级（项目 → 库内文件夹）+ 文档预览结构（目录 / 正文 / 片段）
 */

export type DocParseStatus = "已解析" | "解析中" | "待重嵌入" | "失败";

/** 与参考稿一致：顶层文档目录分类 */
export type TreeRootCategory =
  | "项目资料"
  | "家族治理文件"
  | "税务与法律"
  | "通用FAQ";

export type KnowledgeDoc = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  /** 知识树中「项目」下的二级目录（逻辑分组） */
  libraryFolder: string;
  /** 顶层分类；缺省为「项目资料」 */
  categoryRoot?: TreeRootCategory;
  /** 非「项目资料」时，树中「根分类 → 该文件夹 → 文档」 */
  folderInCategory?: string;
  /** 预览区页数（演示） */
  estimatedPages?: number;
  /** 版本历史（演示） */
  versionHistory?: { label: string; date: string; current?: boolean }[];
  docType: string;
  format: "PDF" | "DOCX" | "XLSX" | "MD" | "PPTX";
  parseStatus: DocParseStatus;
  chunks: number;
  vectors: number;
  embeddingModel: string;
  indexNamespace: string;
  sizeMb: number;
  version: number;
  updatedAt: string;
  uploader: string;
  piiScan: "通过" | "待复核" | "已脱敏";
  tags: string[];
  note?: string;
};

export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: "kd-001",
    title: "白虾供应链_尽调备忘录_内部版.pdf",
    projectId: "shrimp",
    projectName: "白虾供应链联合投资",
    libraryFolder: "尽调材料",
    docType: "尽调材料",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 186,
    vectors: 186,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-shrimp-prod",
    sizeMb: 4.2,
    version: 3,
    updatedAt: "2026-04-13",
    uploader: "CandiceGuo",
    piiScan: "已脱敏",
    tags: ["冷链", "FOB", "授信"],
    estimatedPages: 86,
    versionHistory: [
      { label: "当前版本", date: "2026-04-13", current: true },
      { label: "v2.0", date: "2026-02-01" },
      { label: "v1.0", date: "2025-12-20" },
    ],
  },
  {
    id: "kd-002",
    title: "国家地理IP_授权边界与分成_法务联审.docx",
    projectId: "natgeo-rwa",
    projectName: "国家地理濒危物种 IP 数字货币项目",
    libraryFolder: "合规与授权",
    docType: "合规 / 法务",
    format: "DOCX",
    parseStatus: "已解析",
    chunks: 94,
    vectors: 94,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-natgeo-staging",
    sizeMb: 1.1,
    version: 2,
    updatedAt: "2026-04-12",
    uploader: "JimmyHuang",
    piiScan: "待复核",
    tags: ["授权", "分成", "合规"],
  },
  {
    id: "kd-003",
    title: "港美专户_波动率预警处置纪要_2026Q1.md",
    projectId: "hk-us-equity",
    projectName: "港美二级市场专户",
    libraryFolder: "会议纪要",
    docType: "会议纪要",
    format: "MD",
    parseStatus: "解析中",
    chunks: 42,
    vectors: 0,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-hk-equity",
    sizeMb: 0.35,
    version: 1,
    updatedAt: "2026-04-14",
    uploader: "JensenFang",
    piiScan: "通过",
    tags: ["预警", "专户"],
    note: "分段已完成，向量写入队列 2/3",
  },
  {
    id: "kd-004",
    title: "离岸信托_CRS_受益人变更草案.pdf",
    projectId: "offshore-trust",
    projectName: "离岸信托架构优化",
    libraryFolder: "架构与合规",
    docType: "架构 / 合规",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 128,
    vectors: 128,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-trust-restricted",
    sizeMb: 2.7,
    version: 4,
    updatedAt: "2026-04-10",
    uploader: "JimmyHuang",
    piiScan: "已脱敏",
    tags: ["CRS", "受益人", "受限"],
  },
  {
    id: "kd-005",
    title: "新能源并购_并网与补贴目录_运营台账.xlsx",
    projectId: "energy-ma",
    projectName: "新能源并购储备池",
    libraryFolder: "运营数据",
    docType: "运营数据",
    format: "XLSX",
    parseStatus: "待重嵌入",
    chunks: 56,
    vectors: 56,
    embeddingModel: "text-embedding-3-small",
    indexNamespace: "fo-v1-energy-legacy",
    sizeMb: 0.88,
    version: 2,
    updatedAt: "2026-03-28",
    uploader: "JessicaHu",
    piiScan: "通过",
    tags: ["并网", "补贴"],
    note: "模型从 small 升级至 large 后需全量重嵌入",
  },
  {
    id: "kd-006",
    title: "数字化门户_等保测评差距项清单.docx",
    projectId: "digital-portal",
    projectName: "家族数字化门户",
    libraryFolder: "安全评估",
    docType: "安全评估",
    format: "DOCX",
    parseStatus: "失败",
    chunks: 0,
    vectors: 0,
    embeddingModel: "—",
    indexNamespace: "fo-v2-portal-paused",
    sizeMb: 0.62,
    version: 1,
    updatedAt: "2026-04-01",
    uploader: "JessicaHu",
    piiScan: "待复核",
    tags: ["等保", "测评"],
    note: "扫描件 OCR 置信度不足，已退回业务补扫",
  },
  {
    id: "kd-007",
    title: "跨境大宗_信用证与货权流转_单证样本集.pdf",
    projectId: "cross-trade",
    projectName: "跨境大宗贸易周转",
    libraryFolder: "单证与样本",
    docType: "单证样例",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 210,
    vectors: 210,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-trade-lc",
    sizeMb: 5.4,
    version: 5,
    updatedAt: "2026-04-11",
    uploader: "CandiceGuo",
    piiScan: "已脱敏",
    tags: ["信用证", "货权"],
  },
  {
    id: "kd-008",
    title: "欧洲酒店收购_标的清单与CapRate假设_v3.pptx",
    projectId: "europe-hotel-ma",
    projectName: "欧洲精品酒店收购",
    libraryFolder: "投资备忘录",
    docType: "投资备忘录",
    format: "PPTX",
    parseStatus: "已解析",
    chunks: 73,
    vectors: 73,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-eu-hotel",
    sizeMb: 12.8,
    version: 3,
    updatedAt: "2026-04-09",
    uploader: "JimmyHuang",
    piiScan: "通过",
    tags: ["CapRate", "酒店"],
  },
  {
    id: "gd-001",
    title: "家族章程_议事规则模板.pdf",
    projectId: "governance",
    projectName: "—",
    libraryFolder: "—",
    docType: "治理文件",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 48,
    vectors: 48,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-governance",
    sizeMb: 1.2,
    version: 1,
    updatedAt: "2026-04-08",
    uploader: "CandiceGuo",
    piiScan: "通过",
    tags: ["章程", "议事"],
    categoryRoot: "家族治理文件",
    folderInCategory: "章程与议事",
    estimatedPages: 12,
    versionHistory: [
      { label: "当前版本", date: "2026-04-08", current: true },
      { label: "v1.0", date: "2025-11-15" },
    ],
  },
  {
    id: "tx-001",
    title: "CRS_申报口径备忘.pdf",
    projectId: "tax",
    projectName: "—",
    libraryFolder: "—",
    docType: "税务合规",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 36,
    vectors: 36,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-tax",
    sizeMb: 0.9,
    version: 2,
    updatedAt: "2026-04-05",
    uploader: "JimmyHuang",
    piiScan: "已脱敏",
    tags: ["CRS", "申报"],
    categoryRoot: "税务与法律",
    folderInCategory: "跨境税务",
    estimatedPages: 10,
    versionHistory: [
      { label: "当前版本", date: "2026-04-05", current: true },
      { label: "v1.0", date: "2025-12-20" },
    ],
  },
  {
    id: "faq-001",
    title: "通用FAQ_工作台使用说明.md",
    projectId: "faq",
    projectName: "—",
    libraryFolder: "—",
    docType: "帮助文档",
    format: "MD",
    parseStatus: "已解析",
    chunks: 22,
    vectors: 22,
    embeddingModel: "text-embedding-3-small",
    indexNamespace: "fo-v2-faq",
    sizeMb: 0.15,
    version: 4,
    updatedAt: "2026-04-01",
    uploader: "CandiceGuo",
    piiScan: "通过",
    tags: ["FAQ", "工作台"],
    categoryRoot: "通用FAQ",
    folderInCategory: "帮助中心",
    estimatedPages: 6,
    versionHistory: [
      { label: "当前版本", date: "2026-04-01", current: true },
      { label: "v3.0", date: "2026-01-10" },
      { label: "v1.0", date: "2025-08-01" },
    ],
  },
  {
    id: "faq-002",
    title: "产品手册.pdf",
    projectId: "faq",
    projectName: "—",
    libraryFolder: "—",
    docType: "产品手册",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 64,
    vectors: 64,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-product-docs",
    sizeMb: 2.4,
    version: 1,
    updatedAt: "2026-04-14",
    uploader: "CandiceGuo",
    piiScan: "通过",
    tags: ["产品", "手册", "平台"],
    categoryRoot: "通用FAQ",
    folderInCategory: "帮助中心",
    estimatedPages: 28,
    versionHistory: [
      { label: "当前版本", date: "2026-04-14", current: true },
    ],
  },
];

export type TocItem = {
  level: 1 | 2 | 3;
  title: string;
  page?: number;
};

/** 文档预览：目录 + 正文摘录 + 向量片段（模拟） */
export type DocPreviewContent = {
  pageRangeLabel: string;
  toc: TocItem[];
  bodyExcerpt: string;
  chunks: { rank: number; chunkId: string; score: number; snippet: string }[];
  /** 入库流水线：与解析状态对应 */
  pipeline: { step: string; status: "done" | "running" | "blocked" | "pending" }[];
};

export const DOC_PREVIEWS: Record<string, DocPreviewContent> = {
  "kd-001": {
    pageRangeLabel: "预览第 1–2 页（共 28 页）",
    toc: [
      { level: 1, title: "交易结构概览", page: 1 },
      { level: 2, title: "标的与交割前提", page: 2 },
      { level: 2, title: "冷链与检验条款", page: 5 },
      { level: 1, title: "资金与授信安排", page: 8 },
    ],
    bodyExcerpt:
      "1. 交易结构概览\n\n本项目以厄瓜多尔白虾 FOB 为基础，华东冷链为交割与温控节点。华南资本已确认人民币叁仟万元整…\n\n2. 标的与交割前提\n\n（a）装运港检验证书由 SGS 出具；（b）远东集团意向函所载付款节点与本轮条款对齐后方可进入合同定稿…",
    chunks: [
      {
        rank: 1,
        chunkId: "shrimp-ch-12",
        score: 0.89,
        snippet:
          "…装运港检验证书须不晚于提单日后 5 个工作日提交，否则买方有权暂缓支付第二笔款项…",
      },
      {
        rank: 2,
        chunkId: "shrimp-ch-47",
        score: 0.81,
        snippet:
          "…授信银行保函格式见附件 B；受益人字段已按合规要求替换为 [REDACTED]…",
      },
    ],
    pipeline: [
      { step: "上传与病毒扫描", status: "done" },
      { step: "OCR / 版式解析", status: "done" },
      { step: "分段与 PII 扫描", status: "done" },
      { step: "向量写入", status: "done" },
      { step: "索引一致性校验", status: "done" },
    ],
  },
  "kd-002": {
    pageRangeLabel: "Word 结构视图（无页码）",
    toc: [
      { level: 1, title: "授权范围", page: 1 },
      { level: 2, title: "地域与渠道", page: 1 },
      { level: 2, title: "衍生权利", page: 2 },
      { level: 1, title: "分成与结算", page: 3 },
    ],
    bodyExcerpt:
      "一、授权范围\n\n1.1 被许可方在中华人民共和国境内（为本协议之目的不含港澳台）享有非独占、不可转让之数字发行权…\n\n二、分成与结算\n\n2.1 净收入定义见附件一；2.2 结算周期为自然季度结束后 45 日内…",
    chunks: [
      {
        rank: 1,
        chunkId: "natgeo-ch-03",
        score: 0.84,
        snippet:
          "…二级流通场景下，若监管要求补充披露，双方应先行协商对外口径…",
      },
    ],
    pipeline: [
      { step: "上传与病毒扫描", status: "done" },
      { step: "Office 解析", status: "done" },
      { step: "分段与 PII 扫描", status: "done" },
      { step: "向量写入", status: "done" },
      { step: "法务待复核队列", status: "running" },
    ],
  },
  "kd-004": {
    pageRangeLabel: "预览第 1 页（共 14 页）",
    toc: [
      { level: 1, title: "信托层级与主体", page: 1 },
      { level: 2, title: "BVI / 香港中间层", page: 1 },
      { level: 1, title: "CRS 与受益人", page: 4 },
    ],
    bodyExcerpt:
      "信托层级与主体\n\n本架构在 Ocean Ridge（BVI）设立控股 SPV，香港公司作为中间层持有境内运营资产…受益人变更须取得受托人书面同意及经济实质申报更新…",
    chunks: [
      {
        rank: 1,
        chunkId: "trust-ch-08",
        score: 0.88,
        snippet:
          "…受益人变更触发条件包括：婚姻状态重大变化、国籍变更或 CRS 申报主体变更…",
      },
    ],
    pipeline: [
      { step: "上传与病毒扫描", status: "done" },
      { step: "OCR / 版式解析", status: "done" },
      { step: "分段与 PII 扫描", status: "done" },
      { step: "向量写入（受限区）", status: "done" },
      { step: "索引一致性校验", status: "done" },
    ],
  },
  "faq-002": {
    pageRangeLabel: "预览第 1–3 页（共 28 页）",
    toc: [
      { level: 1, title: "产品概览与角色", page: 1 },
      { level: 2, title: "家族端与顾问端", page: 1 },
      { level: 1, title: "核心功能模块", page: 5 },
      { level: 2, title: "工作台与待办", page: 5 },
      { level: 2, title: "知识库与权限", page: 12 },
      { level: 1, title: "安全与合规说明", page: 20 },
    ],
    bodyExcerpt:
      "1 产品概览\n\n家办平台面向家族办公室与顾问团队，提供统一的工作台、在管项目视图、知识库检索与对话留痕…\n\n2 核心功能模块\n\n工作台聚合待办与审批；知识库支持按项目与分类浏览，检索结果可引用至对话与报告草稿…",
    chunks: [
      {
        rank: 1,
        chunkId: "pm-ch-01",
        score: 0.91,
        snippet:
          "…权限模型按「家族成员 / 顾问 / 运营」分层，敏感文档仅在有授权的项目命名空间内可见…",
      },
      {
        rank: 2,
        chunkId: "pm-ch-14",
        score: 0.84,
        snippet:
          "…对话与工具调用记录可按会话导出，用于合规审计与内部复盘（需具备相应审计角色）…",
      },
    ],
    pipeline: [
      { step: "上传与病毒扫描", status: "done" },
      { step: "OCR / 版式解析", status: "done" },
      { step: "分段与 PII 扫描", status: "done" },
      { step: "向量写入", status: "done" },
      { step: "索引一致性校验", status: "done" },
    ],
  },
};

export function getDocPreview(
  docId: string,
  doc?: KnowledgeDoc
): DocPreviewContent {
  const rich = DOC_PREVIEWS[docId];
  if (rich) return rich;

  const st = doc?.parseStatus;
  const blocked = st === "失败";
  const running = st === "解析中" || st === "待重嵌入";

  const pipeline: DocPreviewContent["pipeline"] = blocked
    ? [
        { step: "上传与病毒扫描", status: "done" },
        { step: "OCR / 版式解析", status: "blocked" },
        { step: "分段与 PII 扫描", status: "pending" },
        { step: "向量写入", status: "pending" },
        { step: "索引一致性校验", status: "pending" },
      ]
    : running
      ? [
          { step: "上传与病毒扫描", status: "done" },
          { step: "OCR / 版式解析", status: "done" },
          { step: "分段与 PII 扫描", status: "running" },
          { step: "向量写入", status: st === "解析中" ? "running" : "pending" },
          { step: "索引一致性校验", status: "pending" },
        ]
      : [
          { step: "上传与病毒扫描", status: "done" },
          { step: "OCR / 版式解析", status: "done" },
          { step: "分段与 PII 扫描", status: "done" },
          { step: "向量写入", status: "done" },
          { step: "索引一致性校验", status: "done" },
        ];

  return {
    pageRangeLabel: blocked
      ? "无法生成预览（解析失败）"
      : running
        ? "正文与目录生成中…"
        : "节选预览（未配置富结构）",
    toc: [
      { level: 1, title: doc?.title.replace(/\.[^.]+$/, "") ?? "未命名", page: 1 },
      { level: 2, title: "（自动生成占位目录）", page: 1 },
    ],
    bodyExcerpt:
      doc?.note ??
      "该文档尚未配置完整目录树；表格中仍可查看分段与命名空间。可对接解析服务填充 TOC 与页码。",
    chunks: doc && doc.vectors > 0
      ? [
          {
            rank: 1,
            chunkId: `${doc.projectId}-ch-auto`,
            score: 0.72,
            snippet:
              "…（自动摘要）与「" +
              (doc.tags[0] ?? "项目") +
              "」相关的条款与数据已入库，可在对话中通过检索引用…",
          },
        ]
      : [],
    pipeline,
  };
}

/** 按项目 → 文件夹分组，供「项目资料」树使用 */
export function groupDocsForTree(docs: KnowledgeDoc[]) {
  const byProject = new Map<string, Map<string, KnowledgeDoc[]>>();
  for (const d of docs) {
    if (getDocCategoryRoot(d) !== "项目资料") continue;
    if (!byProject.has(d.projectName)) {
      byProject.set(d.projectName, new Map());
    }
    const fm = byProject.get(d.projectName)!;
    if (!fm.has(d.libraryFolder)) fm.set(d.libraryFolder, []);
    fm.get(d.libraryFolder)!.push(d);
  }
  return byProject;
}

export function getDocCategoryRoot(d: KnowledgeDoc): TreeRootCategory {
  return d.categoryRoot ?? "项目资料";
}

export function getEstimatedPages(d: KnowledgeDoc): number {
  if (d.estimatedPages != null) return d.estimatedPages;
  return Math.max(1, Math.round(d.chunks / 3));
}

/** 与参考 UI 一致：已学习 / 学习中 / 待更新 / 失败 */
export function getLearnBadgeLabel(status: DocParseStatus): string {
  switch (status) {
    case "已解析":
      return "已学习";
    case "解析中":
      return "学习中";
    case "待重嵌入":
      return "待更新";
    case "失败":
      return "失败";
  }
}

export function getLearnDotClass(status: DocParseStatus): string {
  switch (status) {
    case "已解析":
      return "bg-emerald-500";
    case "解析中":
    case "待重嵌入":
      return "bg-amber-400";
    case "失败":
      return "bg-red-500";
  }
}

export function getVersionHistoryForDoc(d: KnowledgeDoc) {
  if (d.versionHistory?.length) return d.versionHistory;
  return [
    { label: "当前版本", date: d.updatedAt, current: true },
    { label: `v${Math.max(1, d.version - 1)}.0`, date: "2025-12-20" },
  ];
}

/** 非「项目资料」：根分类 → 文件夹 → 文档 */
export function groupOtherCategoryDocs(
  docs: KnowledgeDoc[],
  root: TreeRootCategory
): Map<string, KnowledgeDoc[]> {
  const m = new Map<string, KnowledgeDoc[]>();
  for (const d of docs) {
    if (getDocCategoryRoot(d) !== root) continue;
    const folder = d.folderInCategory ?? "通用";
    if (!m.has(folder)) m.set(folder, []);
    m.get(folder)!.push(d);
  }
  return m;
}

export const TREE_ROOT_ORDER: TreeRootCategory[] = [
  "项目资料",
  "家族治理文件",
  "税务与法律",
  "通用FAQ",
];
