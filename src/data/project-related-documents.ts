/**
 * 项目详情「相关文档」演示数据。
 * 项目文档：对应工作台项目详情 / 资料包上传（scope=package）。
 * 对话文档：对应对话内上传、已入库附件（scope=session），须标注所属用户。
 */

export type DocParseStatus = "已解析" | "解析中" | "失败";

export type ProjectPackageDocument = {
  filename: string;
  parseStatus: DocParseStatus;
  uploadedAt: string;
  uploadedBy: string;
};

export type ConversationSessionDocument = {
  filename: string;
  parseStatus: DocParseStatus;
  userId: string;
  userName: string;
  userOrg: string;
  conversationId: string;
  uploadedAt: string;
};

export type ProjectRelatedDocuments = {
  projectDocuments: ProjectPackageDocument[];
  conversationDocuments: ConversationSessionDocument[];
};

const RELATED_DOCS_BY_PROJECT: Record<string, ProjectRelatedDocuments> = {
  "proj-87c4b0718f58": {
    projectDocuments: [
      {
        filename: "源天生物bp 2026年4月 简版.pdf",
        parseStatus: "已解析",
        uploadedAt: "2026-06-04",
        uploadedBy: "JensenFang",
      },
    ],
    conversationDocuments: [
      {
        filename: "酶法再生工艺补充说明_内部批注.pdf",
        parseStatus: "已解析",
        userId: "jensen-fang",
        userName: "JensenFang",
        userOrg: "研究部 · Low",
        conversationId: "proj-87c4b0718f58-main",
        uploadedAt: "2026-06-12",
      },
      {
        filename: "rPET 竞品对标表_202606.xlsx",
        parseStatus: "已解析",
        userId: "jimmy-huang",
        userName: "JimmyHuang",
        userOrg: "家族办公室 · Core",
        conversationId: "sess_pet_core_01",
        uploadedAt: "2026-06-18",
      },
    ],
  },
  "proj-4a974e67c0f9": {
    projectDocuments: [
      {
        filename: "演员AI版权投资_授权框架备忘录.pdf",
        parseStatus: "已解析",
        uploadedAt: "2026-06-15",
        uploadedBy: "JessicaHu",
      },
      {
        filename: "短剧制片预算测算_v2.xlsx",
        parseStatus: "已解析",
        uploadedAt: "2026-06-20",
        uploadedBy: "JessicaHu",
      },
    ],
    conversationDocuments: [
      {
        filename: "艺人授权清单_脱敏版.xlsx",
        parseStatus: "已解析",
        userId: "jessica-hu",
        userName: "JessicaHu",
        userOrg: "投资顾问 · Mid",
        conversationId: "sess_aishort_mid_02",
        uploadedAt: "2026-06-22",
      },
      {
        filename: "平台分成条款对比_法务批注.docx",
        parseStatus: "解析中",
        userId: "candice-guo",
        userName: "CandiceGuo",
        userOrg: "合域 · Admin",
        conversationId: "sess_aishort_admin_01",
        uploadedAt: "2026-06-24",
      },
    ],
  },
  "proj-535a240acf88": {
    projectDocuments: [
      {
        filename: "多肽供应链_中澳合规路径说明.pdf",
        parseStatus: "已解析",
        uploadedAt: "2026-05-29",
        uploadedBy: "JessicaHu",
      },
      {
        filename: "配置药房合作意向函_扫描件.pdf",
        parseStatus: "已解析",
        uploadedAt: "2026-06-08",
        uploadedBy: "JessicaHu",
      },
    ],
    conversationDocuments: [
      {
        filename: "BPC-157 产品规格与定价草案.pdf",
        parseStatus: "已解析",
        userId: "jessica-hu",
        userName: "JessicaHu",
        userOrg: "投资顾问 · Mid",
        conversationId: "proj-535a240acf88-main",
        uploadedAt: "2026-06-10",
      },
      {
        filename: "TGA 进口路径问答摘录.docx",
        parseStatus: "已解析",
        userId: "peptide",
        userName: "peptide",
        userOrg: "访客 · 多肽项目",
        conversationId: "sess_peptide_guest",
        uploadedAt: "2026-06-16",
      },
    ],
  },
  "proj-7c0f947a6a00": {
    projectDocuments: [
      {
        filename: "霍尔果斯易货配额政策摘录.pdf",
        parseStatus: "已解析",
        uploadedAt: "2026-05-27",
        uploadedBy: "JensenFang",
      },
      {
        filename: "中亚品类清单与汇率假设.xlsx",
        parseStatus: "已解析",
        uploadedAt: "2026-06-01",
        uploadedBy: "JensenFang",
      },
    ],
    conversationDocuments: [
      {
        filename: "首批互换品类报价单_202605.pdf",
        parseStatus: "已解析",
        userId: "jensen-fang",
        userName: "JensenFang",
        userOrg: "研究部 · Low",
        conversationId: "proj-7c0f947a6a00-main",
        uploadedAt: "2026-06-03",
      },
      {
        filename: "口岸物流时效测算.xlsx",
        parseStatus: "已解析",
        userId: "jimmy-huang",
        userName: "JimmyHuang",
        userOrg: "家族办公室 · Core",
        conversationId: "sess_trade_core_03",
        uploadedAt: "2026-06-14",
      },
    ],
  },
};

const EMPTY_RELATED: ProjectRelatedDocuments = {
  projectDocuments: [],
  conversationDocuments: [],
};

export function getRelatedDocumentsForProject(
  projectId: string
): ProjectRelatedDocuments {
  return RELATED_DOCS_BY_PROJECT[projectId] ?? EMPTY_RELATED;
}
