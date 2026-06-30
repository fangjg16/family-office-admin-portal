/**
 * Agent 知识结构：与在管项目一一对应，来源字段为示意性知识库文件名（假定已批量入库）。
 */

import { ALL_PROJECTS, type WorkspaceProject } from "./platform";
import { PROJECT_OVERVIEW_METRICS_BY_ID } from "./project-overview-metrics";

export type AgentFactLeaf = {
  key: string;
  value: string;
  /** 假定来自已上传知识库的文件名 */
  source: string;
};

export type AgentThemeNode = {
  id: string;
  title: string;
  defaultExpanded: boolean;
  facts: AgentFactLeaf[];
};

/** 每项目 5 条事实对应的示意文件名（与 key 顺序一致：规模、净值、起投、风险、业务要点） */
const KB_FILES_BY_PROJECT: Record<string, readonly [string, string, string, string, string]> = {
  "proj-87c4b0718f58": [
    "源天生物_产能规划与资金用途_202606.xlsx",
    "PET酶法再生_成本曲线与竞品对标.pdf",
    "源天生物_中试里程碑与送样计划.docx",
    "Biotech_风险评级矩阵_内部.pdf",
    "源天生物bp 2026年4月 简版.pdf",
  ],
  "proj-4a974e67c0f9": [
    "演员AI版权_授权框架与分成口径.xlsx",
    "短剧制片预算测算_v2.xlsx",
    "艺人授权清单_脱敏版.xlsx",
    "文娱IP_风险复盘_内部.pdf",
    "演员AI版权投资_授权框架备忘录.pdf",
  ],
  "proj-535a240acf88": [
    "多肽供应链_中澳合规路径说明.pdf",
    "BPC-157_产品规格与定价草案.pdf",
    "配置药房合作意向函_扫描件.pdf",
    "Biotech_跨境合规_风险纪要.pdf",
    "多肽产品_渠道毛利测算_v2.xlsx",
  ],
  "proj-7c0f947a6a00": [
    "中亚品类清单与汇率假设.xlsx",
    "霍尔果斯易货配额政策摘录.pdf",
    "口岸物流时效测算.xlsx",
    "国际贸易_风险敞口_月报.pdf",
    "首批互换品类报价单_202605.pdf",
  ],
};

function businessHighlight(summary: string): string {
  const s = summary.trim();
  if (s.length <= 56) return s;
  return `${s.slice(0, 54)}…`;
}

function factsForProject(p: WorkspaceProject): AgentFactLeaf[] {
  const m = PROJECT_OVERVIEW_METRICS_BY_ID[p.id];
  const files = KB_FILES_BY_PROJECT[p.id];
  if (!m || !files) {
    return [
      {
        key: "项目摘要",
        value: businessHighlight(p.summary),
        source: `${p.name}_项目摘要_内部.pdf`,
      },
    ];
  }
  return [
    { key: "规模（管理口径）", value: m.scaleLabel, source: files[0] },
    { key: "净值 / 参考", value: m.netValueLabel, source: files[1] },
    { key: "起投", value: m.minInvestWanLabel, source: files[2] },
    { key: "风险程度", value: m.riskLevel, source: files[3] },
    { key: "业务要点", value: businessHighlight(p.summary), source: files[4] },
  ];
}

/** 与 ALL_PROJECTS 顺序一致，覆盖全部在管项目 */
export function buildAgentKnowledgeThemes(): AgentThemeNode[] {
  return ALL_PROJECTS.map((p, i) => ({
    id: p.id,
    title: p.name,
    defaultExpanded: i === 0,
    facts: factsForProject(p),
  }));
}
