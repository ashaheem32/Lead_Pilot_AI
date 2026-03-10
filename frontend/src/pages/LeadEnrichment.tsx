import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { leadService } from '../services/leadService';
import { Skeleton } from '../components/Skeleton';
import { Lead } from '../types';
import { 
  Layers, 
  Loader2, 
  ChevronDown, 
  Users, 
  Building2, 
  Zap, 
  Target, 
  Sword, 
  Copy, 
  Check, 
  RefreshCw, 
  Trash2, 
  MessageSquare,
  Sparkles,
  Download,
  ExternalLink,
  Briefcase,
  ArrowRight,
  Database,
  Search,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';

export const LeadEnrichment = () => {
  const navigate = useNavigate();
  const { leads, updateLead, removeLead } = useLeads();
  const { showToast } = useToast();
  const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const [isEnrichingAll, setIsEnrichingAll] = useState(false);
  const [enrichAllProgress, setEnrichAllProgress] = useState(0);

  const enrichedLeadsCount = useMemo(() => leads.filter(l => l.status === 'enriched' || l.status === 'contacted').length, [leads]);
  const pendingLeadsCount = leads.length - enrichedLeadsCount;

  const handleEnrich = async (lead: Lead) => {
    setEnrichingIds(prev => new Set(prev).add(lead.id));
    try {
      const enrichment = await leadService.enrichLead(lead);
      updateLead(lead.id, { 
        ...enrichment, 
        status: 'enriched' 
      });
      setExpandedId(lead.id);
      showToast(`${lead.company} enrichment complete!`, 'success');
    } catch (error) {
      showToast(`Failed to enrich ${lead.company}`, 'error');
    } finally {
      setEnrichingIds(prev => {
        const next = new Set(prev);
        next.delete(lead.id);
        return next;
      });
    }
  };

  const handleEnrichAll = async () => {
    const pending = leads.filter(l => l.status === 'new');
    if (pending.length === 0) return;

    setIsEnrichingAll(true);
    setEnrichAllProgress(0);
    
    let completed = 0;
    for (const lead of pending) {
      await handleEnrich(lead);
      completed++;
      setEnrichAllProgress((completed / pending.length) * 100);
    }
    
    setIsEnrichingAll(false);
    showToast(`Enrichment complete for ${completed} leads!`, 'success');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [id]: true });
    showToast('Copied to clipboard', 'info');
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const exportToCSV = () => {
    showToast('Exporting enrichment data...', 'info');
  };

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (score >= 50) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (score >= 30) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const getConfidenceColor = (conf: string | undefined) => {
    switch (conf) {
      case 'High': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'Medium': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'Low': return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lead Enrichment</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5"><Database size={12} /> {leads.length} selected</span>
              <div className="w-1 h-1 bg-border rounded-full"></div>
              <span className="text-emerald-500 flex items-center gap-1.5"><Check size={12} /> {enrichedLeadsCount} enriched</span>
              <div className="w-1 h-1 bg-border rounded-full"></div>
              <span className="text-orange-500 flex items-center gap-1.5"><RefreshCw size={12} /> {pendingLeadsCount} pending</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            disabled={leads.length === 0}
            className="px-4 py-2 bg-background text-foreground border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-muted flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download size={14} /> Export
          </button>
          
          <div className="relative group">
            <button 
              onClick={handleEnrichAll}
              disabled={isEnrichingAll || pendingLeadsCount === 0}
              className={cn(
                "px-6 py-2 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/25 interactive-hover",
                (isEnrichingAll || pendingLeadsCount === 0) && "opacity-50 cursor-not-allowed shadow-none"
              )}
            >
              {isEnrichingAll ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Enrich All
            </button>
            {isEnrichingAll && (
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${enrichAllProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border-2 border-dashed border-border animate-fade-in">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Layers size={40} className="text-muted-foreground/30" />
          </div>
          <h2 className="text-xl font-bold">No Leads Selected</h2>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm">
            Start by identifying leads in the Lead Finder.
          </p>
          <button 
            onClick={() => navigate('/finder')}
            className="mt-8 px-8 py-3 bg-foreground text-background rounded-xl text-xs font-bold uppercase tracking-widest transition-all interactive-hover mx-auto flex items-center gap-2"
          >
            <Search size={16} /> Go to Lead Finder
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div 
              key={lead.id} 
              className={cn(
                "bg-card rounded-xl border transition-all duration-300 group overflow-hidden",
                expandedId === lead.id 
                  ? "border-primary shadow-subtle ring-1 ring-primary/10" 
                  : "border-border shadow-sm hover:border-primary/40"
              )}
            >
              {/* Card Header */}
              <div 
                className={cn(
                  "p-5 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 cursor-pointer",
                  expandedId === lead.id ? "bg-primary/[0.02]" : "hover:bg-muted/30"
                )}
                onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-xl font-bold text-foreground group-hover:bg-background transition-colors">
                    {lead.company.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">{lead.company}</span>
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-lg text-[10px] font-bold uppercase border border-border">{lead.industry}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                        <Users size={12} /> {lead.contacts?.[0]?.name || 'Pending'}
                      </div>
                      <div className="w-1 h-1 bg-border rounded-full"></div>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                        <Briefcase size={12} /> {lead.title || 'Role Pending'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Fit</span>
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold border",
                      getFitScoreColor(lead.fitScore)
                    )}>{lead.fitScore}</span>
                  </div>
                  
                  {lead.status === 'enriched' && (
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Conf.</span>
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold border",
                        getConfidenceColor(lead.enrichmentScore)
                      )}>{lead.enrichmentScore}</span>
                    </div>
                  )}

                  <div className={cn(
                    "ml-2 p-2 rounded-lg text-muted-foreground transition-all duration-300",
                    expandedId === lead.id ? "bg-primary text-white rotate-180" : "bg-muted"
                  )}>
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Card Expanded Content */}
              {expandedId === lead.id && (
                <div className="border-t border-border p-6 bg-muted/10 animate-slide-down">
                  {lead.status === 'new' ? (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border shadow-subtle">
                        <Sparkles size={32} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold">Research Required</h3>
                      <p className="text-muted-foreground mt-1 mb-6 text-sm max-w-xs mx-auto">Analyze stakeholders and tech stack.</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEnrich(lead); }}
                        disabled={enrichingIds.has(lead.id)}
                        className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto interactive-hover"
                      >
                        {enrichingIds.has(lead.id) ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Start Research
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contacts */}
                        <div className="bg-card p-5 rounded-xl border border-border">
                          <h4 className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                            <Users size={14} className="text-primary" /> Decision Makers
                          </h4>
                          <div className="space-y-3">
                            {lead.contacts?.map((contact, idx) => (
                              <div key={idx} className="p-4 bg-muted/30 rounded-xl border border-border">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <div className="font-bold text-sm">{contact.name}</div>
                                    <div className="text-[10px] font-medium text-muted-foreground uppercase">{contact.title}</div>
                                  </div>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-lg text-[8px] font-bold border",
                                    contact.roleRelevance === 'High' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                  )}>{contact.roleRelevance}</span>
                                </div>
                                <div className="flex items-center justify-between bg-card px-3 py-1.5 rounded-lg border border-border text-[10px]">
                                  <span className="text-muted-foreground truncate mr-2">{contact.email}</span>
                                  <button onClick={() => handleCopy(contact.email, `${lead.id}-e-${idx}`)} className="p-1 hover:text-primary transition-colors">
                                    {copyStatus[`${lead.id}-e-${idx}`] ? <Check size={12} /> : <Copy size={12} />}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech & Intelligence */}
                        <div className="bg-card p-5 rounded-xl border border-border">
                          <h4 className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                            <Building2 size={14} className="text-primary" /> Intelligence
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Tech Stack</span>
                              <div className="flex flex-wrap gap-1.5">
                                {lead.techStack?.map((tech, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-muted text-[10px] font-bold rounded-lg border border-border">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-muted/30 rounded-xl border border-border">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Tool Spend</span>
                                <div className="text-xs font-bold">{lead.estimatedToolSpend}</div>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-xl border border-border">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Growth</span>
                                <div className="text-xs font-bold">{lead.growthStage}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Triggers */}
                        <div className="bg-card p-5 rounded-xl border border-border md:col-span-2">
                          <h4 className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                            <Zap size={14} className="text-orange-500" /> Triggers
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {lead.triggers?.map((trigger, idx) => (
                              <div key={idx} className="p-4 bg-muted/30 rounded-xl border border-border">
                                <div className="text-xs font-bold mb-2 leading-relaxed">{trigger.description}</div>
                                <div className="flex items-center gap-2 mt-auto">
                                  <span className="text-[9px] font-bold text-muted-foreground px-1.5 py-0.5 bg-background rounded border border-border">{trigger.date}</span>
                                  <span className={cn(
                                    "text-[9px] font-bold px-1.5 py-0.5 rounded border",
                                    trigger.impact === 'High' ? "text-emerald-500 border-emerald-500/20" : "text-muted-foreground"
                                  )}>{trigger.impact}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleEnrich(lead)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Re-enrich">
                            <RefreshCw size={18} />
                          </button>
                          <button onClick={() => removeLead(lead.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Remove">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <button 
                          onClick={() => navigate('/outreach', { state: { leadId: lead.id } })}
                          className="px-6 py-2.5 bg-foreground text-background rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 interactive-hover shadow-lg"
                        >
                          <MessageSquare size={16} /> Outreach
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )} 
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
