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

const CHART_COLORS = [
  "hsl(217, 91%, 55%)",
  "hsl(199, 89%, 48%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(142, 71%, 45%)",
];

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
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 24% 90%)" />
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
          fill="hsl(217 91% 70%)"
          stroke="hsl(217 91% 45%)"
          fillOpacity={0.55}
          name="输入"
        />
        <Area
          type="monotone"
          dataKey="output"
          stackId="1"
          fill="hsl(199 89% 55%)"
          stroke="hsl(199 89% 42%)"
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
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 24% 90%)" />
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
            style: { fontSize: 10, fill: "hsl(215 16% 47%)" },
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
            style: { fontSize: 10, fill: "hsl(215 16% 47%)" },
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
          stroke="hsl(217, 91%, 48%)"
          strokeWidth={2}
          dot={{ r: 2.5, fill: "hsl(217, 91%, 48%)" }}
          activeDot={{ r: 4 }}
        />
        <Line
          yAxisId="conversations"
          type="monotone"
          dataKey="conversations"
          name="对话数量"
          stroke="hsl(199, 89%, 42%)"
          strokeWidth={2}
          dot={{ r: 2.5, fill: "hsl(199, 89%, 42%)" }}
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
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 24% 90%)" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
        <Tooltip formatter={(v: number) => `$${v}`} />
        <Bar
          dataKey="cost"
          fill="hsl(38, 92%, 50%)"
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
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 24% 90%)" />
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
          fill="hsl(217 91% 70%)"
          stroke="hsl(217 91% 45%)"
          fillOpacity={0.55}
          name="输入 Token"
        />
        <Area
          type="monotone"
          dataKey="output"
          stackId="1"
          fill="hsl(199 89% 55%)"
          stroke="hsl(199 89% 42%)"
          fillOpacity={0.55}
          name="输出 Token"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
