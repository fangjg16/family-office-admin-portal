/**
 * 管理后台「在管项目」等指标：独立口径，与 @/data/platform 中项目 id 一一对应。
 * 规模/净值/起投：D1 项目表暂无字段，未披露项以「—」占位；风险为管理演示口径。
 * 项目主数据同步自生产 API（见 platform.ts 注释）。
 */

import { ALL_PROJECTS } from "./platform";

export type ProjectRiskLevel = "低" | "中" | "中高" | "高";

export type ProjectOverviewMetric = {
  /** 规模，如「2.6 亿」 */
  scaleLabel: string;
  /** 净值或参考净值，暂无则「—」 */
  netValueLabel: string;
  /** 起投，万元 */
  minInvestWanLabel: string;
  riskLevel: ProjectRiskLevel;
};

/** 与 ALL_PROJECTS[].id 对齐 */
export const PROJECT_OVERVIEW_METRICS_BY_ID: Record<string, ProjectOverviewMetric> =
  {
    "proj-87c4b0718f58": {
      scaleLabel: "—",
      netValueLabel: "—",
      minInvestWanLabel: "—",
      riskLevel: "中高",
    },
    "proj-4a974e67c0f9": {
      scaleLabel: "—",
      netValueLabel: "—",
      minInvestWanLabel: "—",
      riskLevel: "中高",
    },
    "proj-535a240acf88": {
      scaleLabel: "—",
      netValueLabel: "—",
      minInvestWanLabel: "—",
      riskLevel: "中高",
    },
    "proj-7c0f947a6a00": {
      scaleLabel: "—",
      netValueLabel: "—",
      minInvestWanLabel: "—",
      riskLevel: "中",
    },
  };

export type ProjectOverviewRow = {
  id: string;
  name: string;
  phase: string;
} & ProjectOverviewMetric;

/** 与 ALL_PROJECTS 顺序一致，供表格等渲染 */
export function getProjectOverviewRows(): ProjectOverviewRow[] {
  return ALL_PROJECTS.map((p) => {
    const m = PROJECT_OVERVIEW_METRICS_BY_ID[p.id];
    if (!m) {
      throw new Error(`project-overview-metrics: missing metrics for ${p.id}`);
    }
    return {
      id: p.id,
      name: p.name,
      phase: p.phase,
      ...m,
    };
  });
}
