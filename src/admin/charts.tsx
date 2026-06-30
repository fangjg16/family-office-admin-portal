import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/** 合域品牌图表色：酒红 / 深酒红 / 陶土 / 鼠尾草 */
const CHART_COLORS = [
  "hsl(5, 32%, 46%)",
  "hsl(353, 32%, 43%)",
  "hsl(18, 28%, 58%)",
  "hsl(353, 42%, 32%)",
  "hsl(145, 18%, 42%)",
];

const GRID_STROKE = "hsl(34 16% 88%)";
const AXIS_LABEL = "hsl(25 10% 45%)";
const WINE = "hsl(5, 32%, 46%)";
const WINE_LIGHT = "hsl(5 32% 72%)";
const TERRACOTTA = "hsl(18, 28%, 58%)";
const TERRACOTTA_LIGHT = "hsl(18 28% 72%)";

export function TokenAreaChart({
  data,
  height = 240,
  xInterval = 4,
}: {
  data: { date: string; input: number; output: number }[];
  height?: number;
  xInterval?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ left: 0, right: 4, top: 6, bottom: 22 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: height >= 200 ? 11 : 9 }}
          interval={xInterval}
        />
        <YAxis
          width={height >= 200 ? 40 : 32}
          tick={{ fontSize: height >= 200 ? 11 : 9 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip formatter={(v: number) => v.toLocaleString()} />
        <Area
          type="monotone"
          dataKey="input"
          stackId="1"
          fill={WINE_LIGHT}
          stroke={WINE}
          fillOpacity={0.55}
          name="输入"
        />
        <Area
          type="monotone"
          dataKey="output"
          stackId="1"
          fill={TERRACOTTA_LIGHT}
          stroke={TERRACOTTA}
          fillOpacity={0.55}
          name="输出"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ActiveUsersLineChart({
  data,
  height = 220,
}: {
  data: {
    date: string;
    activeUsers: number;
    conversations: number;
  }[];
  height?: number;
}) {
  const fs = height >= 180 ? 11 : 9;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ left: 2, right: 8, top: 8, bottom: 16 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
        <XAxis dataKey="date" tick={{ fontSize: fs }} interval={2} />
        <YAxis
          yAxisId="users"
          orientation="left"
          allowDecimals={false}
          width={36}
          tick={{ fontSize: fs }}
          domain={[0, "auto"]}
          tickFormatter={(v) => `${v}`}
          label={{
            value: "用户数",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 10, fill: AXIS_LABEL },
          }}
        />
        <YAxis
          yAxisId="conversations"
          orientation="right"
          allowDecimals={false}
          width={40}
          tick={{ fontSize: fs }}
          domain={[0, "auto"]}
          tickFormatter={(v) => `${v}`}
          label={{
            value: "对话数",
            angle: 90,
            position: "insideRight",
            style: { fontSize: 10, fill: AXIS_LABEL },
          }}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === "活跃用户") return [`${value} 人`, name];
            if (name === "对话数量") return [`${value} 次`, name];
            return [value, name];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 2 }}
          iconType="circle"
          iconSize={8}
        />
        <Line
          yAxisId="users"
          type="monotone"
          dataKey="activeUsers"
          name="活跃用户"
          stroke={WINE}
          strokeWidth={2}
          dot={{ r: 2.5, fill: WINE }}
          activeDot={{ r: 4 }}
        />
        <Line
          yAxisId="conversations"
          type="monotone"
          dataKey="conversations"
          name="对话数量"
          stroke={TERRACOTTA}
          strokeWidth={2}
          dot={{ r: 2.5, fill: TERRACOTTA }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PhasePieChart({
  data,
  height = 200,
  outerRadius = 75,
  showSectorLabels = true,
}: {
  data: { name: string; value: number }[];
  height?: number;
  outerRadius?: number;
  showSectorLabels?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={outerRadius}
          dataKey="value"
          label={
            showSectorLabels
              ? ({ name, value }) => `${name} ${value}`
              : false
          }
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TokenCostBarChart({
  data,
}: {
  data: { date: string; cost: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
        <Tooltip formatter={(v: number) => `$${v}`} />
        <Bar
          dataKey="cost"
          fill={TERRACOTTA}
          radius={[2, 2, 0, 0]}
          name="成本"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TokenStackedAreaChart({
  data,
}: {
  data: { date: string; input: number; output: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip formatter={(v: number) => v.toLocaleString()} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="input"
          stackId="1"
          fill={WINE_LIGHT}
          stroke={WINE}
          fillOpacity={0.55}
          name="输入 Token"
        />
        <Area
          type="monotone"
          dataKey="output"
          stackId="1"
          fill={TERRACOTTA_LIGHT}
          stroke={TERRACOTTA}
          fillOpacity={0.55}
          name="输出 Token"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
