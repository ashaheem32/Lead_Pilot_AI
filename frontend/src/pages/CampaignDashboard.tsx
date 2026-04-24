import React, { useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Sparkles, 
  Send, 
  Target,
  Database,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  FileJson,
  FileSpreadsheet,
  Trophy,
  Mail,
  Linkedin,
  Phone,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-3 shadow-subtle rounded-xl border border-border animate-fade-in">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label || payload[0].name}</p>
        <p className="text-sm font-bold text-foreground">
          {`${payload[0].name ? '' : 'Leads: '}${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

export const CampaignDashboard = () => {
  const { leads } = useLeads();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    const enrichedLeads = leads.filter(l => l.status === 'enriched' || l.status === 'contacted').length;
    const outreachCreated = leads.filter(l => l.outreachSequences).length;
    const avgFitScore = totalLeads > 0 
      ? Math.round(leads.reduce((acc, curr) => acc + curr.fitScore, 0) / totalLeads) 
      : 0;

    return { totalLeads, enrichedLeads, outreachCreated, avgFitScore };
  }, [leads]);

  const funnelData = useMemo(() => {
    return [
      { name: 'Found', value: leads.length, color: '#4f6ef7' },
      { name: 'Enriched', value: leads.filter(l => l.status === 'enriched' || l.status === 'contacted').length, color: '#6366f1' },
      { name: 'Ready', value: leads.filter(l => l.outreachSequences).length, color: '#10b981' },
      { name: 'Sent', value: leads.filter(l => l.status === 'contacted').length, color: '#f59e0b' },
    ];
  }, [leads]);

  const industryData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { counts[l.industry] = (counts[l.industry] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [leads]);

  const COLORS = ['#4f6ef7', '#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const handleExport = (type: string) => {
    showToast(`Exporting ${type} report...`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl border border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Analytics</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Dashboard</h1>
          <p className="text-muted-foreground text-sm">Real-time performance across your pipeline.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-bold uppercase border border-emerald-500/20 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            System Operational
          </div>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border-2 border-dashed border-border">
          <BarChart3 size={48} className="text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Dashboard Empty</h2>
          <p className="text-muted-foreground text-sm mt-1">Populate your pipeline to see analytics.</p>
          <button onClick={() => navigate('/finder')} className="mt-8 px-8 py-3 bg-foreground text-background rounded-xl text-xs font-bold uppercase tracking-widest interactive-hover flex items-center gap-2 mx-auto">
            <Zap size={16} /> Find Leads
          </button>
        </div>
      ) : (
        <>
          {/* ROW 1 - METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard label="Leads Found" value={metrics.totalLeads} icon={<Users size={20} />} color="blue" />
            <MetricCard label="Enriched" value={metrics.enrichedLeads} icon={<Database size={20} />} color="purple" />
            <MetricCard label="Outreach" value={metrics.outreachCreated} icon={<Send size={20} />} color="emerald" />
            <MetricCard label="Avg Fit" value={metrics.avgFitScore} icon={<Target size={20} />} color="amber" isScore />
          </div>

          {/* ROW 2 - CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-subtle">
              <h3 className="font-bold mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-primary" /> Pipeline Funnel</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: isDark ? '#9ca3af' : '#6b7280' }} width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                      {funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-subtle">
              <h3 className="font-bold mb-6 flex items-center gap-2"><PieChartIcon size={18} className="text-primary" /> Industry Mix</h3>
              <div className="h-64 flex flex-col sm:flex-row items-center">
                <div className="flex-1 h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={industryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {industryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-48 space-y-2 mt-4 sm:mt-0">
                  {industryData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] font-bold">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} /> {item.name}</div>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3 - TABLE */}
          <div className="bg-card rounded-xl border border-border shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-bold flex items-center gap-2"><Trophy size={18} className="text-amber-500" /> Priority Leads</h3>
            </div>
            {/* Mobile Priority Leads */}
            <div className="sm:hidden divide-y divide-border">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors" onClick={() => navigate('/outreach', { state: { leadId: lead.id } })}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">{lead.company[0]}</div>
                    <div>
                      <div className="text-sm font-bold">{lead.company}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{lead.industry}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-primary mb-1">{lead.fitScore} Fit</div>
                    <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase", lead.outreachSequences ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}>
                      {lead.outreachSequences ? 'Ready' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <th className="px-6 py-3">Lead</th>
                    <th className="px-6 py-3">Industry</th>
                    <th className="px-6 py-3">Fit</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="table-row-alt hover:bg-primary/[0.02] transition-colors cursor-pointer" onClick={() => navigate('/outreach', { state: { leadId: lead.id } })}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{lead.company[0]}</div>
                          <span className="font-bold text-sm">{lead.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">{lead.industry}</td>
                      <td className="px-6 py-4"><span className="text-xs font-bold text-primary">{lead.fitScore}</span></td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase", lead.outreachSequences ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}>
                          {lead.outreachSequences ? 'Ready' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ROW 4 - EXPORTS */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Download size={24} /></div>
              <div>
                <h3 className="font-bold">Export Center</h3>
                <p className="text-xs text-muted-foreground">Download comprehensive pipeline reports.</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => handleExport('Full')} className="flex-1 px-4 py-2 bg-foreground text-background rounded-lg text-[10px] font-bold uppercase tracking-widest interactive-hover flex items-center justify-center gap-2"><FileSpreadsheet size={16} /> Campaign</button>
              <button onClick={() => handleExport('Outreach')} className="flex-1 px-4 py-2 bg-muted text-foreground border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest interactive-hover flex items-center justify-center gap-2"><FileJson size={16} /> Outreach</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MetricCard = ({ label, value, icon, color, isScore = false }: any) => {
  return (
    <div className="bg-card p-5 rounded-xl border border-border shadow-subtle interactive-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">{icon}</div>
        <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 uppercase tracking-widest">+12%</div>
      </div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {isScore && <span className="text-muted-foreground text-xs font-medium">/100</span>}
      </div>
    </div>
  );
};