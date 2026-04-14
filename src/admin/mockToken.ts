/** 演示用 Token 曲线（与业务数据解耦） */
export function buildTokenDailyData(days = 30) {
  const out: {
    date: string;
    input: number;
    output: number;
    total: number;
    cost: number;
  }[] = [];
  const end = new Date(2026, 3, 14);
  for (let i = 0; i < days; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - (days - 1 - i));
    const base = 45000 + Math.sin(i / 4) * 8000 + ((i * 137) % 9000);
    const input = Math.round(base * 0.6);
    const output = Math.round(base * 0.4);
    const total = input + output;
    const cost = +(total * 0.00003).toFixed(2);
    out.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      input,
      output,
      total,
      cost,
    });
  }
  return out;
}

/** 演示用「日活跃 + 对话量」曲线（与业务数据解耦） */
export function buildActiveUserDailyData(days = 14) {
  const out: {
    date: string;
    activeUsers: number;
    conversations: number;
  }[] = [];
  const end = new Date(2026, 3, 14);
  for (let i = 0; i < days; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - (days - 1 - i));
    const activeUsers = Math.max(
      4,
      Math.round(
        14 + Math.sin(i / 2.2) * 4 + ((i * 73) % 7) - (i % 3) * 2
      )
    );
    // 对话数通常高于活跃人数（一人可产生多会话），按演示波动生成
    const conversations = Math.max(
      28,
      Math.round(
        activeUsers * 4.2 +
          Math.cos(i / 1.8) * 18 +
          ((i * 41) % 25) +
          (i % 4) * 6
      )
    );
    out.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      activeUsers,
      conversations,
    });
  }
  return out;
}
