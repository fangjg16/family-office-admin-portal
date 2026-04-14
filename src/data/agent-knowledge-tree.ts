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
  shrimp: [
    "白虾供应链_管理口径规模与币种_202603.xlsx",
    "厄瓜多尔产地_FOB报价与检验批次_台账.pdf",
    "华东冷链_承运与温控 SLA 附件.docx",
    "食品农业赛道_风险评级矩阵_Q1.pdf",
    "白虾项目_出资方意向与在途函证_汇总.pdf",
  ],
  "natgeo-rwa": [
    "国家地理IP_授权边界与发行结构_法务联审.pdf",
    "数字发行_总盘子敏感性测算_内部.xlsx",
    "濒危物种主题_合规披露清单_v4.docx",
    "数字资产_IP赛道_风险评估纪要_202604.pdf",
    "民生系对接_IP合作备忘录_节选.pdf",
  ],
  "europe-hotel-ma": [
    "欧洲酒店收购_标的池与估值模型_202603.xlsx",
    "南欧标的_尽调问题清单与回复.docx",
    "酒店旅游_汇率与运营假设_附件.pdf",
    "并购管线_风险标签与缓释措施.pdf",
    "欧洲精品酒店_项目周会纪要_W12.pdf",
  ],
  "coastal-estate": [
    "滨海旧改SPV_评估与规模口径_管理后台同步.xlsx",
    "海通资管_劣后意向条款谈判记录.pdf",
    "城市更新_征拆与配资进度_双周报.docx",
    "地产基金_风险程度复核_风控签批.pdf",
    "核心区旧改_项目摘要_内部版.pdf",
  ],
  "cross-trade": [
    "大宗贸易_本期信用证台账_LC.xlsx",
    "南美大豆_棕榈油_在途货权与检验.pdf",
    "单证中心_待补检验批次说明.docx",
    "贸易周转_授信与风险敞口_月报.pdf",
    "跨境大宗_项目摘要与银行沟通纪要.pdf",
  ],
  "digital-portal": [
    "家族门户_合同与付款进度_神州数码.pdf",
    "等保测评_换签重提问题列表_202604.xlsx",
    "阿里云_资源与接口清单_运维.docx",
    "数字化项目_风险复盘_暂停说明.pdf",
    "门户一期_验收未达标项_整改追踪.pdf",
  ],
  "ip-invest": [
    "文娱IP联合体_已付定金与仲裁进展.xlsx",
    "主投视频平台_终止函_扫描件.pdf",
    "文娱赛道_项目状态_已取消_审计留痕.docx",
    "IP投资_风险标签_历史.pdf",
    "文娱IP_内部摘要_终止后材料索引.pdf",
  ],
  "hk-us-equity": [
    "港美专户_组合规模与净值口径_托管对账.xlsx",
    "中行香港_托管账户流水_节选.pdf",
    "华泰_IB通道_费率与路由说明.docx",
    "证券专户_风险预警与波动率处理记录.pdf",
    "港美二级市场_项目摘要_策略组.pdf",
  ],
  "energy-ma": [
    "苏北电站_并网容量与对赌条款_投后.xlsx",
    "新能源并购_补贴目录申报材料.pdf",
    "120MW_地面电站_购售电合同摘要.docx",
    "能源赛道_风险评级_投后季报.pdf",
    "产业方对赌_发电量考核说明_内部.pdf",
  ],
  "med-channel": [
    "医疗器械渠道_进院家数与集采影响_运营.xlsx",
    "微创心脉_区域总代协议_关键条款.pdf",
    "华东经销_渠道毛利重算模型_v3.xlsx",
    "医疗赛道_风险程度_管理口径.pdf",
    "器械渠道整合_项目摘要_业务组.pdf",
  ],
  "offshore-trust": [
    "离岸架构_Ocean Ridge_SPV 关系图.vsdx",
    "CRS_经济实质补档清单_受托人往来.pdf",
    "香港中间层_持股路径_法审批注.docx",
    "离岸信托_风险程度_合规复核.pdf",
    "受益分配触发_法审闭合条件_备忘录.pdf",
  ],
  "edu-ma": [
    "职教集团_E估值与混改结构_财务模型.xlsx",
    "地方国资_混改谈判要点_纪要.pdf",
    "并购基金_出资意向与条款大纲.docx",
    "教育赛道_风险程度_投前报告.pdf",
    "职业教育并购_项目摘要_教育组.pdf",
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
