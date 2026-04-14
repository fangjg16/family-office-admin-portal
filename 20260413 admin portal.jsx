import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard, Users, Database, Coins, Bot, BookOpen,
  MessageSquare, Settings, Search, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  XCircle, Clock, Eye, Download, RefreshCw, Shield,
  Zap, HardDrive, Activity, Menu, X, ChevronLeft,
  ChevronRight, Filter, BarChart3, ArrowUpDown, ExternalLink,
  AlertCircle, Star, Building2, Briefcase, Landmark, Globe
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts';

const COLORS = ['#6366f1','#22d3ee','#f59e0b','#ef4444','#10b981','#8b5cf6','#f97316','#ec4899'];

const resources = [
  { id:1, name:'恒信地产基金一期', type:'基金', family:'陈氏家族', project:'恒信地产开发', status:'运作中', credibility:92, scale:'5.2亿', risk:'中', liquidity:'低', returnRate:'8.3%', updated:'2026-04-10', agentRef:47 },
  { id:2, name:'安盈固收产品A', type:'固收', family:'张氏家族', project:'安盈资管计划', status:'募集中', credibility:88, scale:'2.0亿', risk:'低', liquidity:'中', returnRate:'4.8%', updated:'2026-04-12', agentRef:62 },
  { id:3, name:'星辰股权一期', type:'股权', family:'李氏家族', project:'科技并购项目', status:'运作中', credibility:85, scale:'3.5亿', risk:'高', liquidity:'极低', returnRate:'22.1%', updated:'2026-04-08', agentRef:31 },
  { id:4, name:'瑞华海外配置', type:'海外', family:'王氏家族', project:'全球资产配置', status:'运作中', credibility:78, scale:'8.0亿', risk:'中高', liquidity:'低', returnRate:'11.5%', updated:'2026-03-15', agentRef:55 },
  { id:5, name:'鼎丰并购基金', type:'股权', family:'陈氏家族', project:'产业并购', status:'退出期', credibility:95, scale:'6.8亿', risk:'高', liquidity:'极低', returnRate:'28.7%', updated:'2026-04-11', agentRef:18 },
  { id:6, name:'东方商业地产REIT', type:'不动产', family:'张氏家族', project:'商业地产投资', status:'运作中', credibility:90, scale:'12.0亿', risk:'中', liquidity:'中', returnRate:'6.2%', updated:'2026-04-09', agentRef:73 },
  { id:7, name:'青云科技成长基金', type:'基金', family:'李氏家族', project:'科技成长投资', status:'募集中', credibility:72, scale:'1.5亿', risk:'高', liquidity:'低', returnRate:'—', updated:'2026-04-13', agentRef:8 },
  { id:8, name:'信达稳健债券', type:'固收', family:'王氏家族', project:'固收增强策略', status:'运作中', credibility:96, scale:'4.0亿', risk:'低', liquidity:'高', returnRate:'3.9%', updated:'2026-04-12', agentRef:89 },
  { id:9, name:'华创医疗产业基金', type:'股权', family:'陈氏家族', project:'医疗健康投资', status:'运作中', credibility:81, scale:'2.8亿', risk:'中高', liquidity:'低', returnRate:'15.3%', updated:'2026-03-28', agentRef:34 },
  { id:10, name:'嘉和家族信托服务', type:'服务', family:'张氏家族', project:'家族传承规划', status:'运作中', credibility:99, scale:'—', risk:'低', liquidity:'高', returnRate:'—', updated:'2026-04-11', agentRef:41 },
  { id:11, name:'新丝路跨境基金', type:'海外', family:'李氏家族', project:'一带一路投资', status:'已清算', credibility:65, scale:'1.2亿', risk:'高', liquidity:'—', returnRate:'9.8%', updated:'2026-01-20', agentRef:2 },
  { id:12, name:'翠湖度假村项目', type:'不动产', family:'王氏家族', project:'文旅地产', status:'暂停', credibility:58, scale:'3.0亿', risk:'中高', liquidity:'极低', returnRate:'—', updated:'2025-12-05', agentRef:0 },
];

const tokenDailyData = Array.from({length:30}, (_,i) => {
  const d = new Date(2026,3,13);
  d.setDate(d.getDate()-29+i);
  const base = 45000 + Math.random()*30000;
  return {
    date: `${d.getMonth()+1}/${d.getDate()}`,
    input: Math.round(base * 0.6),
    output: Math.round(base * 0.4),
    total: Math.round(base),
    cost: +(base * 0.00003).toFixed(2)
  };
});

const userTokenData = [
  { id:1, user:'陈明远', family:'陈氏家族', role:'家族主事人', totalTokens:382400, conversations:145, avgPerConv:2637, lastActive:'2026-04-13', trend:'up' },
  { id:2, user:'张慧琳', family:'张氏家族', role:'投资总监', totalTokens:298700, conversations:112, avgPerConv:2667, lastActive:'2026-04-13', trend:'up' },
  { id:3, user:'李建国', family:'李氏家族', role:'家族主事人', totalTokens:245100, conversations:98, avgPerConv:2501, lastActive:'2026-04-12', trend:'down' },
  { id:4, user:'王芳华', family:'王氏家族', role:'财务顾问', totalTokens:201300, conversations:87, avgPerConv:2314, lastActive:'2026-04-13', trend:'up' },
  { id:5, user:'陈思远', family:'陈氏家族', role:'二代成员', totalTokens:178500, conversations:203, avgPerConv:879, lastActive:'2026-04-12', trend:'up' },
  { id:6, user:'张文博', family:'张氏家族', role:'法务顾问', totalTokens:134200, conversations:56, avgPerConv:2396, lastActive:'2026-04-11', trend:'down' },
  { id:7, user:'李雅婷', family:'李氏家族', role:'二代成员', totalTokens:98700, conversations:134, avgPerConv:737, lastActive:'2026-04-10', trend:'down' },
  { id:8, user:'王大伟', family:'王氏家族', role:'家族主事人', totalTokens:87600, conversations:42, avgPerConv:2086, lastActive:'2026-04-09', trend:'up' },
];

const familyDistribution = [
  { name:'陈氏家族', value:38 },
  { name:'张氏家族', value:28 },
  { name:'李氏家族', value:20 },
  { name:'王氏家族', value:14 },
];

const navItems = [
  { id:'overview', label:'概览', icon: LayoutDashboard },
  { id:'families', label:'家族管理', icon: Users },
  { id:'resources', label:'资源管理', icon: Database },
  { id:'tokens', label:'Token 用量', icon: Coins },
  { id:'agents', label:'Agent 管理', icon: Bot },
  { id:'knowledge', label:'知识库', icon: BookOpen },
  { id:'conversations', label:'对话监控', icon: MessageSquare },
  { id:'settings', label:'系统设置', icon: Settings },
];

function StatusBadge({ status }) {
  const map = {
    '运作中': 'bg-emerald-100 text-emerald-700',
    '募集中': 'bg-blue-100 text-blue-700',
    '退出期': 'bg-amber-100 text-amber-700',
    '已清算': 'bg-gray-200 text-gray-600',
    '暂停': 'bg-red-100 text-red-700',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status]||'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

function RiskBadge({ risk }) {
  const map = {
    '低': 'bg-green-100 text-green-700',
    '中': 'bg-yellow-100 text-yellow-700',
    '中高': 'bg-orange-100 text-orange-700',
    '高': 'bg-red-100 text-red-700',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[risk]||'bg-gray-100 text-gray-600'}`}>{risk}</span>;
}

function CredibilityBar({ value }) {
  const color = value >= 90 ? 'bg-emerald-500' : value >= 75 ? 'bg-yellow-500' : value >= 60 ? 'bg-orange-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{width:`${value}%`}} />
      </div>
      <span className="text-xs text-gray-600 font-medium">{value}</span>
    </div>
  );
}

function TypeIcon({ type }) {
  const map = {
    '基金': <BarChart3 size={14} className="text-indigo-500" />,
    '股权': <Briefcase size={14} className="text-purple-500" />,
    '不动产': <Building2 size={14} className="text-amber-600" />,
    '固收': <Shield size={14} className="text-emerald-500" />,
    '海外': <Globe size={14} className="text-cyan-500" />,
    '服务': <Star size={14} className="text-pink-500" />,
  };
  return map[type] || <Database size={14} className="text-gray-400" />;
}

function SummaryCard({ icon, label, value, sub, trend, color='bg-white' }) {
  return (
    <div className={`${color} rounded-xl p-4 border border-gray-100 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm">{label}</span>
        <div className="p-1.5 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="flex items-center gap-1 mt-1 text-xs">
        {trend === 'up' && <TrendingUp size={12} className="text-emerald-500" />}
        {trend === 'down' && <TrendingDown size={12} className="text-red-500" />}
        <span className={trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}>{sub}</span>
      </div>}
    </div>
  );
}

function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={<Users size={18} className="text-indigo-500"/>} label="家族客户" value="4" sub="+1 本季度" trend="up" />
        <SummaryCard icon={<Database size={18} className="text-cyan-500"/>} label="资源总数" value="12" sub="2 个募集中" />
        <SummaryCard icon={<Activity size={18} className="text-emerald-500"/>} label="活跃用户" value="8" sub="100% 活跃率" trend="up" />
        <SummaryCard icon={<Coins size={18} className="text-amber-500"/>} label="本月 Token" value="1.63M" sub="环比 +12.4%" trend="up" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">近30天 Token 消耗趋势</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={tokenDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{fontSize:11}} interval={4} />
              <YAxis tick={{fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v)=>v.toLocaleString()} />
              <Area type="monotone" dataKey="input" stackId="1" fill="#818cf8" stroke="#6366f1" fillOpacity={0.6} name="输入" />
              <Area type="monotone" dataKey="output" stackId="1" fill="#22d3ee" stroke="#06b6d4" fillOpacity={0.6} name="输出" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">家族 Token 占比</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={familyDistribution} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({name,value})=>`${name} ${value}%`} labelLine={false} >
                {familyDistribution.map((e,i)=><Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {familyDistribution.map((f,i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full inline-block" style={{background:COLORS[i]}} />
                {f.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-3">资源状态概览</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[{s:'运作中',c:7,cl:'text-emerald-600 bg-emerald-50'},{s:'募集中',c:2,cl:'text-blue-600 bg-blue-50'},{s:'退出期',c:1,cl:'text-amber-600 bg-amber-50'},{s:'已清算',c:1,cl:'text-gray-600 bg-gray-50'},{s:'暂停',c:1,cl:'text-red-600 bg-red-50'}].map(x=>(
            <div key={x.s} className={`rounded-lg p-3 ${x.cl}`}>
              <div className="text-2xl font-bold">{x.c}</div>
              <div className="text-sm">{x.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('全部');
  const [familyFilter, setFamilyFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [sortCol, setSortCol] = useState('credibility');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(null);

  const types = ['全部','基金','股权','不动产','固收','海外','服务'];
  const families = ['全部','陈氏家族','张氏家族','李氏家族','王氏家族'];
  const statuses = ['全部','运作中','募集中','退出期','已清算','暂停'];

  const filtered = useMemo(() => {
    let r = [...resources];
    if (search) r = r.filter(x => x.name.includes(search) || x.project.includes(search) || x.family.includes(search));
    if (typeFilter !== '全部') r = r.filter(x => x.type === typeFilter);
    if (familyFilter !== '全部') r = r.filter(x => x.family === familyFilter);
    if (statusFilter !== '全部') r = r.filter(x => x.status === statusFilter);
    r.sort((a,b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return r;
  }, [search, typeFilter, familyFilter, statusFilter, sortCol, sortDir]);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const isStale = (d) => {
    const diff = (new Date('2026-04-13') - new Date(d)) / 86400000;
    return diff > 30;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">资源池</h2>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">{resources.length} 项</span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><Download size={14}/> 导出</button>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><RefreshCw size={14}/> 刷新</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="搜索资源名称、项目、家族..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
              {types.map(t=><option key={t}>{t}</option>)}
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none" value={familyFilter} onChange={e=>setFamilyFilter(e.target.value)}>
              {families.map(t=><option key={t}>{t}</option>)}
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              {statuses.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  {key:'name',label:'资源名称',w:'min-w-40'},
                  {key:'type',label:'类型'},
                  {key:'family',label:'所属家族'},
                  {key:'project',label:'关联项目',w:'min-w-32'},
                  {key:'scale',label:'规模'},
                  {key:'returnRate',label:'收益'},
                  {key:'risk',label:'风险'},
                  {key:'liquidity',label:'流动性'},
                  {key:'credibility',label:'可信度'},
                  {key:'status',label:'状态'},
                  {key:'agentRef',label:'Agent引用'},
                  {key:'updated',label:'更新时间'},
                ].map(col=>(
                  <th key={col.key} className={`text-left py-2.5 px-2 text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-800 select-none ${col.w||''}`} onClick={()=>toggleSort(col.key)}>
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortCol===col.key && (sortDir==='asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className={`border-b border-gray-50 hover:bg-indigo-50/30 cursor-pointer transition ${selected===r.id?'bg-indigo-50':''}`} onClick={()=>setSelected(selected===r.id?null:r.id)}>
                  <td className="py-2.5 px-2 font-medium text-gray-800">
                    <div className="flex items-center gap-1.5">
                      <TypeIcon type={r.type} />
                      {r.name}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-gray-600">{r.type}</td>
                  <td className="py-2.5 px-2 text-gray-600">{r.family}</td>
                  <td className="py-2.5 px-2 text-gray-600">{r.project}</td>
                  <td className="py-2.5 px-2 text-gray-700 font-medium">{r.scale}</td>
                  <td className="py-2.5 px-2 text-gray-700">{r.returnRate}</td>
                  <td className="py-2.5 px-2"><RiskBadge risk={r.risk} /></td>
                  <td className="py-2.5 px-2 text-gray-600">{r.liquidity}</td>
                  <td className="py-2.5 px-2"><CredibilityBar value={r.credibility} /></td>
                  <td className="py-2.5 px-2"><StatusBadge status={r.status} /></td>
                  <td className="py-2.5 px-2 text-gray-600 text-center">{r.agentRef}</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-xs ${isStale(r.updated)?'text-red-500 font-semibold':'text-gray-500'}`}>
                      {isStale(r.updated) && <AlertTriangle size={11} className="inline mr-0.5 -mt-0.5" />}
                      {r.updated}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={12} className="py-12 text-center text-gray-400">无匹配资源</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (() => {
        const r = resources.find(x=>x.id===selected);
        return (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2"><TypeIcon type={r.type}/> {r.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{r.family} · {r.project}</p>
              </div>
              <button onClick={()=>setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">规模</div><div className="font-semibold text-gray-800">{r.scale}</div></div>
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">核心收益</div><div className="font-semibold text-gray-800">{r.returnRate}</div></div>
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">可信度</div><div className="font-semibold"><CredibilityBar value={r.credibility}/></div></div>
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Agent 引用</div><div className="font-semibold text-gray-800">{r.agentRef} 次 / 30天</div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><BookOpen size={14}/> 知识库关联</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between text-gray-600"><span>📄 {r.name}_产品说明书.pdf</span><span className="text-emerald-600 text-xs">已解析</span></div>
                  <div className="flex items-center justify-between text-gray-600"><span>📄 {r.name}_尽调报告.pdf</span><span className="text-emerald-600 text-xs">已解析</span></div>
                  {isStale(r.updated) && <div className="mt-2 text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={12}/> 文档超过30天未更新，Agent 认知可能过时</div>}
                </div>
              </div>
              <div className="border border-gray-100 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><Bot size={14}/> Agent 认知摘要</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  「{r.name}」是由{r.family}提供的{r.type}类资源，当前状态为{r.status}。
                  风险等级为{r.risk}，流动性{r.liquidity}，适合风险偏好匹配的中长期配置用户。
                  {r.returnRate !== '—' ? `核心收益指标为${r.returnRate}。` : ''}
                </p>
                <button className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><RefreshCw size={11}/> 重新生成认知</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function TokensPage() {
  const [period, setPeriod] = useState('30d');
  const totalTokens = tokenDailyData.reduce((s,d) => s + d.total, 0);
  const totalCost = tokenDailyData.reduce((s,d) => s + d.cost, 0);
  const avgDaily = Math.round(totalTokens / 30);
  const prevPeriodTokens = totalTokens * 0.89;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Token 用量监控</h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          {[{k:'7d',l:'7天'},{k:'30d',l:'30天'},{k:'90d',l:'90天'}].map(p=>(
            <button key={p.k} onClick={()=>setPeriod(p.k)} className={`px-3 py-1 text-xs rounded-md transition ${period===p.k?'bg-white shadow text-gray-800 font-medium':'text-gray-500 hover:text-gray-700'}`}>{p.l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={<Zap size={18} className="text-indigo-500"/>} label="总 Token 消耗" value={`${(totalTokens/1000000).toFixed(2)}M`} sub={`环比 +${((totalTokens/prevPeriodTokens-1)*100).toFixed(1)}%`} trend="up" />
        <SummaryCard icon={<Coins size={18} className="text-amber-500"/>} label="估算成本" value={`$${totalCost.toFixed(0)}`} sub="基于当前模型单价" />
        <SummaryCard icon={<Activity size={18} className="text-cyan-500"/>} label="日均消耗" value={`${(avgDaily/1000).toFixed(1)}k`} sub="输入60% / 输出40%" />
        <SummaryCard icon={<Users size={18} className="text-emerald-500"/>} label="活跃用户" value="8" sub="全部用户均有调用" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-1">每日 Token 消耗</h3>
          <p className="text-xs text-gray-400 mb-3">输入 Token 与 输出 Token 堆叠展示</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={tokenDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{fontSize:11}} interval={4} />
              <YAxis tick={{fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v)=>v.toLocaleString()} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:12}} />
              <Area type="monotone" dataKey="input" stackId="1" fill="#818cf8" stroke="#6366f1" fillOpacity={0.6} name="输入 Token" />
              <Area type="monotone" dataKey="output" stackId="1" fill="#22d3ee" stroke="#06b6d4" fillOpacity={0.6} name="输出 Token" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-1">每日估算成本</h3>
          <p className="text-xs text-gray-400 mb-3">美元计价</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={tokenDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{fontSize:10}} interval={6} />
              <YAxis tick={{fontSize:11}} tickFormatter={v=>`$${v}`} />
              <Tooltip formatter={(v)=>`$${v}`} />
              <Bar dataKey="cost" fill="#f59e0b" radius={[2,2,0,0]} name="成本" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-800">各用户 Token 明细</h3>
            <p className="text-xs text-gray-400">按本月累计消耗排序</p>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><Download size={14}/> 导出</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-500">用户</th>
                <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-500">所属家族</th>
                <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-500">角色</th>
                <th className="text-right py-2.5 px-2 text-xs font-semibold text-gray-500">总 Token</th>
                <th className="text-right py-2.5 px-2 text-xs font-semibold text-gray-500">对话数</th>
                <th className="text-right py-2.5 px-2 text-xs font-semibold text-gray-500">平均/对话</th>
                <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-500">趋势</th>
                <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-500">最后活跃</th>
              </tr>
            </thead>
            <tbody>
              {userTokenData.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-2.5 px-2 font-medium text-gray-800">{u.user}</td>
                  <td className="py-2.5 px-2 text-gray-600">{u.family}</td>
                  <td className="py-2.5 px-2"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{u.role}</span></td>
                  <td className="py-2.5 px-2 text-right font-medium text-gray-800">{u.totalTokens.toLocaleString()}</td>
                  <td className="py-2.5 px-2 text-right text-gray-600">{u.conversations}</td>
                  <td className="py-2.5 px-2 text-right text-gray-600">{u.avgPerConv.toLocaleString()}</td>
                  <td className="py-2.5 px-2">
                    {u.trend==='up' ? <TrendingUp size={14} className="text-emerald-500"/> : <TrendingDown size={14} className="text-red-400"/>}
                  </td>
                  <td className="py-2.5 px-2 text-gray-500 text-xs">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-3">家族维度汇总</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {f:'陈氏家族',t:560900,c:348,color:'bg-indigo-50 border-indigo-200'},
            {f:'张氏家族',t:432900,c:168,color:'bg-cyan-50 border-cyan-200'},
            {f:'李氏家族',t:343800,c:232,color:'bg-amber-50 border-amber-200'},
            {f:'王氏家族',t:288900,c:129,color:'bg-emerald-50 border-emerald-200'},
          ].map(x => (
            <div key={x.f} className={`rounded-lg border p-3 ${x.color}`}>
              <div className="text-sm font-semibold text-gray-800">{x.f}</div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Token: {(x.t/1000).toFixed(1)}k</span>
                <span>对话: {x.c}</span>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-600">
                <span>成本: ${(x.t*0.00003).toFixed(2)}</span>
                <span>占比: {((x.t / 1626500)*100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-gray-400">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><Settings size={28} /></div>
      <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      <p className="text-sm mt-1">{desc}</p>
    </div>
  );
}

export default function AdminPortal() {
  const [page, setPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (page) {
      case 'overview': return <OverviewPage />;
      case 'resources': return <ResourcesPage />;
      case 'tokens': return <TokensPage />;
      case 'families': return <PlaceholderPage title="家族管理" desc="管理所有家族客户的账号与配置" />;
      case 'agents': return <PlaceholderPage title="Agent 管理" desc="管理所有已部署的 AI Agent 实例" />;
      case 'knowledge': return <PlaceholderPage title="知识库" desc="管理文档、数据源与向量索引" />;
      case 'conversations': return <PlaceholderPage title="对话监控" desc="实时监控所有 Agent 与用户的对话记录" />;
      case 'settings': return <PlaceholderPage title="系统设置" desc="平台全局配置、权限管理" />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      <aside className={`${sidebarOpen ? 'w-52' : 'w-14'} bg-slate-900 text-white flex flex-col transition-all duration-200 flex-shrink-0`}>
        <div className="flex items-center justify-between px-3 h-14 border-b border-slate-700">
          {sidebarOpen && <span className="text-sm font-bold tracking-wide">JFO Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-700 rounded-md transition">
            {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
        </div>
        <nav className="flex-1 py-2 space-y-0.5 px-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition ${active ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <Icon size={17} />
                {sidebarOpen && <span>{item.label}</span>}
                {!sidebarOpen && item.id === 'resources' && false}
              </button>
            );
          })}
        </nav>
        {sidebarOpen && (
          <div className="p-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">A</div>
              <div className="text-xs"><div className="font-medium">Admin</div><div className="text-slate-400">超级管理员</div></div>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-base font-semibold text-gray-800">
            {navItems.find(n => n.id === page)?.label || '概览'}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>2026-04-13</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs">系统正常</span>
          </div>
        </header>
        <div className="p-6 max-w-screen-xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}