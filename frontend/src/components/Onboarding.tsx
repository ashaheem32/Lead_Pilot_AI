import React, { useState } from 'react';
import { Zap, ArrowRight, CheckCircle2, Search, Layers, Send } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { cn } from '../lib/utils';

export const Onboarding = () => {
  const { setShowOnboarding } = useLeads();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to LeadPilot AI",
      description: "Automate your sales pipeline with the power of AI agents.",
      icon: Zap,
      color: "bg-primary"
    },
    {
      title: "1. Define ICP",
      description: "Target your ideal customers with precision using advanced filters.",
      icon: Search,
      color: "bg-emerald-500"
    },
    {
      title: "2. Find & Enrich",
      description: "Source leads and enrich them with deep intelligence automatically.",
      icon: Layers,
      color: "bg-indigo-500"
    },
    {
      title: "3. Generate Outreach",
      description: "Create high-converting sequences tailored to every single lead.",
      icon: Send,
      color: "bg-orange-500"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-foreground/50 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-card rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-border">
        <div className="flex flex-col md:flex-row h-full">
          <div className={cn("md:w-1/3 p-8 flex flex-col items-center justify-center text-white transition-colors duration-500", steps[step].color)}>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
              <CurrentIcon size={32} className="text-white" />
            </div>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    i === step ? "w-4 bg-white" : "bg-white/40"
                  )} 
                />
              ))}
            </div>
          </div>
          
          <div className="md:w-2/3 p-10 flex flex-col bg-card">
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight mb-2">{steps[step].title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                {steps[step].description}
              </p>
              
              <div className="space-y-3">
                {step === 0 && [
                  "AI-Powered Lead Generation",
                  "Deep Company Enrichment",
                  "Hyper-Personalized Outreach"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-xl border border-border">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-10">
              <button 
                onClick={() => setShowOnboarding(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Skip
              </button>
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/25 interactive-hover"
              >
                {step === steps.length - 1 ? "Get Started" : "Next"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};