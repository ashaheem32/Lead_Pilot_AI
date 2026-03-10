import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Menu, 
  ChevronRight,
  User,
} from 'lucide-react';
import { cn } from '../lib/utils';

const routeMap: Record<string, string> = {
  '/': 'Dashboard',
  '/finder': 'Lead Finder',
  '/enrichment': 'Enrichment',
  '/outreach': 'AI SDR',
  '/advisor': 'AI Advisor'
};

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarCollapsed }) => {
  const location = useLocation();
  const currentModule = routeMap[location.pathname] || 'Dashboard';

  return (
    <header className={cn(
      "h-16 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between transition-all duration-300",
      isSidebarCollapsed ? "sm:ml-20" : "sm:ml-64",
      "ml-0" // Always 0 on mobile because sidebar is hidden
    )}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground sm:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">LeadPilot AI</span>
          <ChevronRight size={14} className="text-muted-foreground/50" />
          <span className="text-primary font-bold">{currentModule}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search pipeline..." 
            className="pl-10 pr-4 py-2 bg-muted border-none rounded-xl text-sm w-48 lg:w-64 focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all outline-none"
          />
        </div>

        <button className="p-2.5 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </button>

        <div className="h-8 w-[1px] bg-border mx-1"></div>

        <div className="flex items-center gap-3 pl-1 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground leading-tight">Shaheem</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Premium Plan</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            S
          </div>
        </div>
      </div>
    </header>
  );
};