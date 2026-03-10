import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { leadService } from '../services/leadService';
import { Skeleton } from '../components/Skeleton';
import { Lead, ProductContext } from '../types';
import { 
  Send, 
  Mail, 
  Linkedin, 
  Phone, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles,
  ChevronDown,
  RotateCcw,
  Edit2,
  Download,
  Building2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Save,
  MessageSquare,
  ArrowRight,
  Target,
  Trophy,
  History,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

const CallSection = ({ title, content, isList = false }: { title: string, content: string, isList?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/30 transition-colors">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{title}</span>
        <ChevronDown size={14} className={cn("text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 animate-slide-down">
          {isList ? (
            <div className="space-y-2">
              {content.split('\n').map((line, i) => (
                <div key={i} className="flex gap-2 text-xs font-medium text-muted-foreground">
                  <div className="w-1 h-1 bg-primary rounded-full mt-1.5 shrink-0" />
                  {line}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-medium italic text-muted-foreground leading-relaxed">"{content}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export const AIOutreach = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { leads, updateLead, productContext, setProductContext } = useLeads();
  const { showToast } = useToast();
  const [isContextExpanded, setIsContextExpanded] = useState(!productContext?.companyName);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [editingEmails, setEditingEmails] = useState<Record<string, boolean>>({});
  const [activeTabs, setActiveTabs] = useState<Record<string, 'email' | 'linkedin' | 'call'>>({});
  const leadRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [localPC, setLocalPC] = useState<ProductContext>(productContext || {
    companyName: '',
    whatYouSell: '',
    keyValueProp: '',
    targetPainPoints: '',
    preferredTone: 'Professional'
  });

  useEffect(() => {
    if (productContext) {
      setLocalPC(productContext);
    }
  }, [productContext]);

  useEffect(() => {
    const state = location.state as { leadId?: string } | null;
    if (state?.leadId && leadRefs.current[state.leadId]) {
      setTimeout(() => {
        leadRefs.current[state.leadId!]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [location.state, leads]);

  const handleSaveContext = () => {
    if (!localPC.companyName) {
      showToast("Company name is required", 'error');
      return;
    }
    setProductContext(localPC);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
    setIsContextExpanded(false);
    showToast("Product context saved!", 'success');
  };

  const handleGenerateLead = async (lead: Lead) => {
    if (!productContext?.companyName) {
      showToast("Save product context first", 'info');
      setIsContextExpanded(true);
      return;
    }
    setGeneratingId(lead.id);
    try {
      const updates = await leadService.generateOutreach(lead, productContext);
      updateLead(lead.id, updates);
      showToast(`Outreach generated!`, 'success');
    } catch (error) {
      showToast("Generation failed", 'error');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleGenerateAll = async () => {
    const enrichedLeads = leads.filter(l => l.status === 'enriched' || l.status === 'contacted');
    if (enrichedLeads.length === 0) return;
    if (!productContext?.companyName) {
      showToast("Save product context first", 'info');
      setIsContextExpanded(true);
      return;
    }

    setGeneratingAll(true);
    let completed = 0;
    for (const lead of enrichedLeads) {
      if (!lead.outreachSequences) {
        setGeneratingId(lead.id);
        const updates = await leadService.generateOutreach(lead, productContext);
        updateLead(lead.id, updates);
      }
      completed++;
      setProgress(Math.round((completed / enrichedLeads.length) * 100));
    }
    setGeneratingAll(false);
    setGeneratingId(null);
    setProgress(0);
    showToast(`Outreach complete!`, 'success');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied!`, 'info');
  };

  const enrichedLeads = leads.filter(l => l.status === 'enriched' || l.status === 'contacted');
  const getActiveTab = (leadId: string) => activeTabs[leadId] || 'email';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl border border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Send size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI Outreach</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI SDR</h1>
          <p className="text-muted-foreground text-sm">Generate personalized sequences for your pipeline.</p>
        </div>
      </div>

      {/* Product Context */}
      <div className={cn(
        "bg-card rounded-xl border transition-all duration-300 shadow-subtle",
        isContextExpanded ? "border-primary" : "border-border"
      )}>
        <button 
          onClick={() => setIsContextExpanded(!isContextExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              isContextExpanded ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}>
              <Building2 size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold">Product Context</h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Personalization engine</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {productContext?.companyName && !isContextExpanded && (
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-widest">
                <CheckCircle2 size={12} /> Ready
              </span>
            )}
            <div className={cn(
              "p-2 rounded-lg transition-all duration-300",
              isContextExpanded ? "bg-primary text-white rotate-180" : "bg-muted"
            )}>
              <ChevronDown size={18} />
            </div>
          </div>
        </button>

        {isContextExpanded && (
          <div className="p-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-down">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Company Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={localPC.companyName}
                  onChange={e => setLocalPC({...localPC, companyName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">What You Sell</label>
                <textarea 
                  className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 h-24"
                  value={localPC.whatYouSell}
                  onChange={e => setLocalPC({...localPC, whatYouSell: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Key Value Prop</label>
                <textarea 
                  className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 h-24"
                  value={localPC.keyValueProp}
                  onChange={e => setLocalPC({...localPC, keyValueProp: e.target.value})}
                />
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSaveContext}
                  className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all interactive-hover flex items-center gap-2"
                >
                  <Save size={16} /> Save Context
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {enrichedLeads.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-xl border-2 border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-muted-foreground/30" />
            </div>
            <h3 className="font-bold">No Leads Ready</h3>
            <p className="text-muted-foreground text-sm mt-1">Enrich leads before generating outreach.</p>
            <button onClick={() => navigate('/enrichment')} className="mt-6 px-6 py-2.5 bg-foreground text-background rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto interactive-hover">
              <Layers size={16} /> Go to Enrichment
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {enrichedLeads.map((lead) => (
              <div 
                key={lead.id} 
                className="bg-card rounded-xl border border-border shadow-subtle overflow-hidden flex flex-col lg:flex-row min-h-[500px] transition-all hover:border-primary/30"
              >
                {/* Side Summary */}
                <div className="lg:w-64 bg-muted/30 p-6 border-r border-border flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-lg">
                      {lead.company[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight">{lead.company}</h4>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">{lead.industry}</span>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
                    <div className="p-4 bg-background rounded-xl border border-border">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Target</p>
                      <p className="text-xs font-bold">{lead.contacts?.[0]?.name || lead.name}</p>
                    </div>

                    <div className="p-4 bg-background rounded-xl border border-border">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Pain Point</p>
                      <p className="text-[11px] font-medium italic text-muted-foreground">"{lead.painPoints?.[0]}"</p>
                    </div>

                    <div className="mt-auto pt-4">
                      <button 
                        onClick={() => handleGenerateLead(lead)}
                        disabled={generatingId === lead.id}
                        className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all interactive-hover flex items-center justify-center gap-2"
                      >
                        {generatingId === lead.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {lead.outreachSequences ? 'Regenerate' : 'Generate'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex-1 flex flex-col bg-card">
                  {lead.outreachSequences ? (
                    <>
                      <div className="flex bg-muted/30 border-b border-border p-1 gap-1">
                        {[
                          { id: 'email', icon: Mail, label: 'Email' },
                          { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
                          { id: 'call', icon: Phone, label: 'Call' }
                        ].map((tab) => (
                          <button 
                            key={tab.id}
                            onClick={() => setActiveTabs({...activeTabs, [lead.id]: tab.id as any})}
                            className={cn(
                              "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-lg transition-all",
                              getActiveTab(lead.id) === tab.id ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-background/50"
                            )}
                          >
                            <tab.icon size={16} /> {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="p-6 flex-1 overflow-y-auto max-h-[600px] scrollbar-thin">
                        {getActiveTab(lead.id) === 'email' && (
                          <div className="space-y-8">
                            {['initial', 'followUp', 'breakup'].map((type, idx) => {
                              const email = (lead.outreachSequences!.emails as any)[type];
                              return (
                                <div key={type} className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-lg bg-primary text-white text-[10px] font-bold flex items-center justify-center">{idx + 1}</span>
                                      <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Step {idx + 1}</h5>
                                    </div>
                                    <button onClick={() => copyToClipboard(email.body, `Email ${idx+1}`)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                                      <Copy size={16} />
                                    </button>
                                  </div>
                                  <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-3">
                                    <div className="pb-3 border-b border-border text-xs font-bold text-foreground">
                                      <span className="text-muted-foreground font-normal">Subject:</span> {email.subject}
                                    </div>
                                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                      {email.body}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {getActiveTab(lead.id) === 'linkedin' && (
                          <div className="space-y-6">
                            <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-primary uppercase">Connection Request</span>
                                <button onClick={() => copyToClipboard(lead.outreachSequences!.linkedin.connectionRequest, 'LI Request')} className="text-muted-foreground hover:text-primary"><Copy size={14}/></button>
                              </div>
                              <p className="text-sm text-muted-foreground italic">"{lead.outreachSequences.linkedin.connectionRequest}"</p>
                            </div>
                            <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-primary uppercase">Follow-Up Message</span>
                                <button onClick={() => copyToClipboard(lead.outreachSequences!.linkedin.followUpInMail, 'LI Followup')} className="text-muted-foreground hover:text-primary"><Copy size={14}/></button>
                              </div>
                              <p className="text-sm text-muted-foreground italic">"{lead.outreachSequences.linkedin.followUpInMail}"</p>
                            </div>
                          </div>
                        )}

                        {getActiveTab(lead.id) === 'call' && (
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                  <Phone size={20} />
                                </div>
                                <h5 className="font-bold text-sm">60-Second Script</h5>
                              </div>
                              <button onClick={() => copyToClipboard(lead.outreachSequences!.coldCall.openingHook, "Full Script")} className="text-[10px] font-bold text-primary uppercase flex items-center gap-1.5"><Copy size={12}/> Copy Full</button>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              <CallSection title="A) Opening Hook" content={lead.outreachSequences.coldCall.openingHook} />
                              <CallSection title="B) Quick Pitch" content={lead.outreachSequences.coldCall.quickPitch} />
                              <CallSection title="C) Questions" content={lead.outreachSequences.coldCall.qualifyingQuestions.join('\n')} isList />
                              <div className="p-4 bg-foreground text-background rounded-xl">
                                <span className="text-[9px] font-bold text-primary uppercase block mb-1">E) The Close</span>
                                <p className="text-sm font-bold italic">"{lead.outreachSequences.coldCall.closeCTA}"</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-muted/10">
                      <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
                        <Loader2 size={24} className="text-muted-foreground/30" />
                      </div>
                      <h4 className="font-bold">Pending Generation</h4>
                      <p className="text-xs text-muted-foreground mt-1 mb-6">Launch SDR agent to create sequences.</p>
                      <button 
                        onClick={() => handleGenerateLead(lead)}
                        disabled={generatingId === lead.id}
                        className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest interactive-hover flex items-center gap-2"
                      >
                        {generatingId === lead.id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Process Lead
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      {enrichedLeads.length > 0 && (
        <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-40">
          <div className="bg-foreground text-background p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4">
            <div className="text-left hidden sm:block">
              <p className="text-[9px] font-bold text-muted-foreground uppercase mb-0.5">Pipeline</p>
              <p className="text-xs font-bold">{progress}% Complete</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={handleGenerateAll}
                disabled={generatingAll}
                className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest interactive-hover flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
              >
                {generatingAll ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Process All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};