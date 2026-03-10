import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Zap,
  Search, 
  Layers, 
  Send, 
  BarChart3,
  Brain,
  Sun,
  Moon,
  Settings,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { icon: Search, label: 'Lead Finder', path: '/finder', shortcut: '1' },
  { icon: Layers, label: 'Enrichment', path: '/enrichment', shortcut: '2' },
  { icon: Send, label: 'AI SDR', path: '/outreach', shortcut: '3' },
  { icon: BarChart3, label: 'Dashboard', path: '/', shortcut: '4' },
  { icon: Brain, label: 'AI Advisor', path: '/advisor', shortcut: '5' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
        const item = navItems.find(i => i.shortcut === e.key);
        if (item) {
          e.preventDefault();
          navigate(item.path);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 hidden sm:flex flex-col shadow-subtle",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Section */}
      <div className={cn(
        "p-6 flex items-center gap-3 mb-4",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Zap size={22} className="text-white fill-current" />
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">LeadPilot AI</h1>
            <p className="text-[10px] text-primary font-bold tracking-widest uppercase">Premium Edition</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group relative",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <item.icon size={20} className={cn(
                  "shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {!isCollapsed && <span className="animate-fade-in">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 space-y-1 mt-auto border-t border-sidebar-border">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-xl transition-all text-sm font-medium group",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? (theme === 'dark' ? "Light Mode" : "Dark Mode") : undefined}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span className="animate-fade-in">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button 
          className={cn(
            "flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-xl transition-all text-sm font-medium group",
            isCollapsed && "justify-center"
          )}
        >
          <Settings size={20} />
          {!isCollapsed && <span className="animate-fade-in">Settings</span>}
        </button>

        {/* User Avatar */}
        <div className={cn(
          "mt-4 bg-sidebar-accent/50 rounded-xl p-3 border border-sidebar-border transition-all duration-300",
          isCollapsed ? "p-2" : "p-3"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              <User size={20} />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-bold truncate text-foreground leading-tight">Alex Rivera</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">Pro</span>
              </div>
            )}
            {!isCollapsed && <LogOut size={16} className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors shrink-0" />}
          </div>
        </div>
      </div>
    </aside>
  );
};
