/**
 * 管理后台「在管项目」等指标：独立口径，与 @/data/platform 中项目 id 一一对应。
 * 数值结合各项目 summary 中的规模/金额线索编排；未在摘要中出现的项为合理占位。
 * 请勿修改 family-office-platform 源码；若工作台侧后续提供正式字段，可在此对接。
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
    shrimp: {
      scaleLabel: "0.85 亿",
      netValueLabel: "—",
      minInvestWanLabel: "100 万",
      riskLevel: "中",
    },
    "natgeo-rwa": {
      scaleLabel: "3.2 亿",
      netValueLabel: "—",
      minInvestWanLabel: "300 万",
      riskLevel: "中高",
    },
    "europe-hotel-ma": {
      scaleLabel: "1.8 亿",
      netValueLabel: "—",
      minInvestWanLabel: "400 万",
      riskLevel: "中高",
    },
    "coastal-estate": {
      scaleLabel: "2.6 亿",
      netValueLabel: "1.05 亿",
      minInvestWanLabel: "500 万",
      riskLevel: "中",
    },
    "cross-trade": {
      scaleLabel: "1.2 亿",
      netValueLabel: "—",
      minInvestWanLabel: "200 万",
      riskLevel: "中",
    },
    "digital-portal": {
      scaleLabel: "0.03 亿",
      netValueLabel: "—",
      minInvestWanLabel: "50 万",
      riskLevel: "中",
    },
    "ip-invest": {
      scaleLabel: "0.8 亿",
      netValueLabel: "—",
      minInvestWanLabel: "—",
      riskLevel: "高",
    },
    "hk-us-equity": {
      scaleLabel: "2.1 亿",
      netValueLabel: "1.88 亿",
      minInvestWanLabel: "50 万",
      riskLevel: "中高",
    },
    "energy-ma": {
      scaleLabel: "4.8 亿",
      netValueLabel: "3.40 亿",
      minInvestWanLabel: "1,000 万",
      riskLevel: "中",
    },
    "med-channel": {
      scaleLabel: "1.2 亿",
      netValueLabel: "0.62 亿",
      minInvestWanLabel: "300 万",
      riskLevel: "中",
    },
    "offshore-trust": {
      scaleLabel: "0.9 亿",
      netValueLabel: "—",
      minInvestWanLabel: "200 万",
      riskLevel: "中高",
    },
    "edu-ma": {
      scaleLabel: "3.5 亿",
      netValueLabel: "—",
      minInvestWanLabel: "800 万",
      riskLevel: "中高",
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
