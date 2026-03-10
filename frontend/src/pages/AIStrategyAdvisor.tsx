import React, { useState, useRef, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { emitter } from '../agentSdk';
import { 
  MessageSquare, 
  Send, 
  User, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  Target, 
  Users, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Brain,
  Clock,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const QUICK_PROMPT_CHIPS = [
  "Which leads should I prioritize?",
  "Analyze my ICP targeting",
  "Suggest better subject lines",
  "Best time to reach out?"
];

const AGENT_ID = "c00af298-c519-4ac1-8cea-b2ed6c6bbd04";

export const AIStrategyAdvisor = () => {
  const { leads, productContext } = useLeads();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'assistant', 
      content: leads.length > 0 
        ? `Hello! I'm your AI Strategy Advisor. I've analyzed your pipeline of **${leads.length} leads**. How can I help you optimize your outreach strategy today?`
        : "Hello! I'm LeadPilot AI. I'm ready to help you build a high-performance sales pipeline. **Start by defining your ICP in the Lead Finder module**.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContext, setShowContext] = useState(window.innerWidth > 1024);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await emitter.emit({
        agentId: AGENT_ID,
        event: 'user_query',
        payload: { query: text, pipelineContext: { leads: leads.slice(0, 10), productContext } }
      });

      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: typeof result === 'string' ? result : (result as any)?.response || "I've analyzed your query.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      showToast("Advisor agent error", 'error');
    } finally {
      setLoading(false);
    }
  };

  const enrichedCount = leads.filter(l => l.status === 'enriched' || l.status === 'contacted').length;
  const outreachCount = leads.filter(l => l.outreachSequences).length;

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-card rounded-xl border border-border shadow-subtle overflow-hidden relative transition-theme">
      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold">Strategy Advisor</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Agent Active</span>
              </div>
            </div>
          </div>
          <button onClick={() => setShowContext(!showContext)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
            <Target size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'assistant' ? "bg-muted text-primary" : "bg-primary text-white"
              )}>
                {msg.role === 'assistant' ? <Brain size={16} /> : <User size={16} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed border",
                msg.role === 'assistant' 
                  ? "bg-muted border-border text-foreground" 
                  : "bg-primary border-primary/20 text-white"
              )}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
                <div className={cn("text-[9px] mt-2 font-medium opacity-50 text-right")}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-muted text-primary flex items-center justify-center shrink-0">
                <Brain size={16} className="animate-pulse" />
              </div>
              <div className="bg-muted border border-border p-4 rounded-2xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {QUICK_PROMPT_CHIPS.map((chip, i) => (
              <button key={i} onClick={() => handleSend(chip)} className="px-3 py-1.5 bg-muted hover:bg-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap transition-colors">
                {chip}
              </button>
            ))}
          </div>
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input); } }}
              placeholder="Ask for strategy advice..."
              className="w-full bg-muted border border-border rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
              rows={2}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={loading || !input.trim()}
              className="absolute right-2 bottom-2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Context Sidebar */}
      <div className={cn(
        "border-l border-border bg-muted/20 transition-all duration-300 overflow-hidden shrink-0",
        showContext ? "w-72" : "w-0"
      )}>
        <div className="w-72 p-6 space-y-8 h-full overflow-y-auto">
          <section>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Pipeline</h3>
            <div className="space-y-3">
              <SummarySmall label="Total Leads" value={leads.length} icon={<Users size={14} />} />
              <SummarySmall label="Enriched" value={enrichedCount} icon={<Layers size={14} />} />
              <SummarySmall label="Ready" value={outreachCount} icon={<Zap size={14} />} />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Priority</h3>
            <div className="space-y-3">
              {leads.slice(0, 3).map((lead, idx) => (
                <div key={lead.id} className="p-3 bg-card rounded-lg border border-border flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">#{idx+1}</div>
                  <span className="text-xs font-bold truncate">{lead.company}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const SummarySmall = ({ label, value, icon }: any) => (
  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon} <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-sm font-bold">{value}</span>
  </div>
);
