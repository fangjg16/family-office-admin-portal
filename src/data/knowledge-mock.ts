import { ALL_PROJECTS } from "./platform";

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
    title: "源天生物bp 2026年4月 简版.pdf",
    projectId: "proj-87c4b0718f58",
    projectName: "PET 源天生物",
    libraryFolder: "项目资料包",
    docType: "商业计划书",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 142,
    vectors: 142,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-proj-87c4b0718f58",
    sizeMb: 3.6,
    version: 2,
    updatedAt: "2026-06-04",
    uploader: "JensenFang",
    piiScan: "通过",
    tags: ["PET", "酶法再生", "产业化"],
    estimatedPages: 48,
    versionHistory: [
      { label: "当前版本", date: "2026-06-04", current: true },
      { label: "v1.0", date: "2026-04-18" },
    ],
  },
  {
    id: "kd-002",
    title: "酶法再生工艺补充说明_内部批注.pdf",
    projectId: "proj-87c4b0718f58",
    projectName: "PET 源天生物",
    libraryFolder: "对话入库",
    docType: "对话附件",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 38,
    vectors: 38,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-proj-87c4b0718f58",
    sizeMb: 0.9,
    version: 1,
    updatedAt: "2026-06-12",
    uploader: "JensenFang",
    piiScan: "已脱敏",
    tags: ["工艺", "批注"],
  },
  {
    id: "kd-003",
    title: "演员AI版权投资_授权框架备忘录.pdf",
    projectId: "proj-4a974e67c0f9",
    projectName: "演员AI版权投资",
    libraryFolder: "项目资料包",
    docType: "法务 / 授权",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 96,
    vectors: 96,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-proj-4a974e67c0f9",
    sizeMb: 2.1,
    version: 2,
    updatedAt: "2026-06-15",
    uploader: "JessicaHu",
    piiScan: "待复核",
    tags: ["AI肖像", "授权", "短剧"],
    estimatedPages: 32,
  },
  {
    id: "kd-004",
    title: "短剧制片预算测算_v2.xlsx",
    projectId: "proj-4a974e67c0f9",
    projectName: "演员AI版权投资",
    libraryFolder: "财务模型",
    docType: "财务测算",
    format: "XLSX",
    parseStatus: "已解析",
    chunks: 44,
    vectors: 44,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-proj-4a974e67c0f9",
    sizeMb: 0.72,
    version: 2,
    updatedAt: "2026-06-20",
    uploader: "JessicaHu",
    piiScan: "通过",
    tags: ["预算", "短剧"],
  },
  {
    id: "kd-005",
    title: "多肽供应链_中澳合规路径说明.pdf",
    projectId: "proj-535a240acf88",
    projectName: "多肽产品中澳供应链",
    libraryFolder: "合规材料",
    docType: "合规说明",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 118,
    vectors: 118,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-proj-535a240acf88",
    sizeMb: 1.8,
    version: 3,
    updatedAt: "2026-05-29",
    uploader: "JessicaHu",
    piiScan: "已脱敏",
    tags: ["TGA", "多肽", "跨境"],
    estimatedPages: 24,
  },
  {
    id: "kd-006",
    title: "配置药房合作意向函_扫描件.pdf",
    projectId: "proj-535a240acf88",
    projectName: "多肽产品中澳供应链",
    libraryFolder: "合作意向",
    docType: "意向函",
    format: "PDF",
    parseStatus: "解析中",
    chunks: 22,
    vectors: 0,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-proj-535a240acf88",
    sizeMb: 1.2,
    version: 1,
    updatedAt: "2026-06-08",
    uploader: "JessicaHu",
    piiScan: "通过",
    tags: ["药房", "澳洲"],
    note: "OCR 已完成，向量写入队列中",
  },
  {
    id: "kd-007",
    title: "霍尔果斯易货配额政策摘录.pdf",
    projectId: "proj-7c0f947a6a00",
    projectName: "中国-中亚易货贸易",
    libraryFolder: "政策与配额",
    docType: "政策摘录",
    format: "PDF",
    parseStatus: "已解析",
    chunks: 64,
    vectors: 64,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-proj-7c0f947a6a00",
    sizeMb: 0.95,
    version: 1,
    updatedAt: "2026-05-27",
    uploader: "JensenFang",
    piiScan: "通过",
    tags: ["易货", "霍尔果斯", "配额"],
    estimatedPages: 18,
  },
  {
    id: "kd-008",
    title: "中亚品类清单与汇率假设.xlsx",
    projectId: "proj-7c0f947a6a00",
    projectName: "中国-中亚易货贸易",
    libraryFolder: "交易测算",
    docType: "运营数据",
    format: "XLSX",
    parseStatus: "已解析",
    chunks: 52,
    vectors: 52,
    embeddingModel: "text-embedding-3-large",
    indexNamespace: "fo-v2-proj-7c0f947a6a00",
    sizeMb: 0.58,
    version: 2,
    updatedAt: "2026-06-01",
    uploader: "JensenFang",
    piiScan: "通过",
    tags: ["品类", "汇率"],
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
    pageRangeLabel: "预览第 1–2 页（共 48 页）",
    toc: [
      { level: 1, title: "公司与技术路线", page: 1 },
      { level: 2, title: "酶法再生 PET 工艺", page: 2 },
      { level: 1, title: "产能与产业化规划", page: 8 },
    ],
    bodyExcerpt:
      "1. 公司与技术路线\n\n源天生物专注于 PET 塑料酶法再生及产业化，核心工艺可将废 PET 转化为可再生单体…\n\n2. 产能规划\n\n一期规划产能与选址方案已与地方政府初步对接，环评与能评处于筹备阶段…",
    chunks: [
      {
        rank: 1,
        chunkId: "pet-ch-08",
        score: 0.87,
        snippet:
          "…酶法再生路线相较化学法回收，在能耗与碳排口径上具备可量化优势…",
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
  "kd-003": {
    pageRangeLabel: "预览第 1 页（共 32 页）",
    toc: [
      { level: 1, title: "授权权利包", page: 1 },
      { level: 2, title: "肖像 / 声音 / 表演风格", page: 1 },
      { level: 1, title: "应用场景与分成", page: 3 },
    ],
    bodyExcerpt:
      "一、授权权利包\n\n被许可方获得演员 AI 肖像、声音及表演风格在短剧制片场景下的非独占使用权…\n\n二、分成与结算\n\n净收入定义见附件；结算周期为自然季度结束后 45 日内…",
    chunks: [
      {
        rank: 1,
        chunkId: "aishort-ch-03",
        score: 0.84,
        snippet:
          "…深度合成内容须按监管要求标注；道德条款约定重大负面舆情时投资方有权暂停使用…",
      },
    ],
    pipeline: [
      { step: "上传与病毒扫描", status: "done" },
      { step: "OCR / 版式解析", status: "done" },
      { step: "分段与 PII 扫描", status: "done" },
      { step: "向量写入", status: "done" },
      { step: "法务待复核队列", status: "running" },
    ],
  },
  "kd-005": {
    pageRangeLabel: "预览第 1 页（共 24 页）",
    toc: [
      { level: 1, title: "中澳监管路径", page: 1 },
      { level: 2, title: "TGA 与配置药房", page: 2 },
      { level: 1, title: "供应链分工", page: 6 },
    ],
    bodyExcerpt:
      "中澳监管路径\n\n中国侧多肽生产须符合 GMP 与出口合规要求；澳洲侧通过配置药房路径实现本地化供应…",
    chunks: [
      {
        rank: 1,
        chunkId: "peptide-ch-05",
        score: 0.86,
        snippet: "…TGA 分类与进口路径须与产品适应症及剂型一并评估…",
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
  "kd-007": {
    pageRangeLabel: "预览第 1 页（共 18 页）",
    toc: [
      { level: 1, title: "易货配额体制", page: 1 },
      { level: 2, title: "霍尔果斯自贸区", page: 1 },
      { level: 1, title: "品类与结算", page: 4 },
    ],
    bodyExcerpt:
      "易货配额体制\n\n中国与中亚国家间政府批准的易货贸易配额，可在霍尔果斯自贸区实现免货币结算的商品互换…",
    chunks: [
      {
        rank: 1,
        chunkId: "trade-ch-02",
        score: 0.83,
        snippet: "…配额使用须与口岸物流时效匹配，货权转移以海关监管库出库为准…",
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

/** 按项目 → 文件夹分组，供「项目资料」树使用（顺序与 ALL_PROJECTS 一致） */
export function groupDocsForTree(docs: KnowledgeDoc[]) {
  const byProject = new Map<string, Map<string, KnowledgeDoc[]>>();
  const order = new Map(ALL_PROJECTS.map((p, i) => [p.name, i]));

  for (const d of docs) {
    if (getDocCategoryRoot(d) !== "项目资料") continue;
    if (!byProject.has(d.projectName)) {
      byProject.set(d.projectName, new Map());
    }
    const fm = byProject.get(d.projectName)!;
    if (!fm.has(d.libraryFolder)) fm.set(d.libraryFolder, []);
    fm.get(d.libraryFolder)!.push(d);
  }

  const sorted = new Map(
    [...byProject.entries()].sort(
      (a, b) => (order.get(a[0]) ?? 99) - (order.get(b[0]) ?? 99)
    )
  );
  return sorted;
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
      return "bg-[hsl(var(--sage))]";
    case "解析中":
    case "待重嵌入":
      return "bg-[hsl(var(--terracotta))]";
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
