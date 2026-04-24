import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { Onboarding } from './Onboarding';
import { useLeads } from '../context/LeadContext';
import { cn } from '../lib/utils';
import { 
  Search, 
  Layers, 
  Send, 
  BarChart3,
  Brain
} from 'lucide-react';

const mobileNavItems = [
  { icon: Search, label: 'Finder', path: '/finder' },
  { icon: Layers, label: 'Enrich', path: '/enrichment' },
  { icon: Send, label: 'AI SDR', path: '/outreach' },
  { icon: BarChart3, label: 'Dashboard', path: '/' },
  { icon: Brain, label: 'Advisor', path: '/advisor' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { showOnboarding } = useLeads();
  const location = useLocation();

  // Responsive logic
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setIsSidebarCollapsed(true);
      } else if (width >= 641 && width <= 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col transition-theme">
      {showOnboarding && <Onboarding />}
      
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header 
          isSidebarCollapsed={isSidebarCollapsed}
          onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        
        <main className={cn(
          "flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 pb-24 sm:pb-8",
          isSidebarCollapsed ? "sm:ml-20" : "sm:ml-64"
        )}>
          <div className="max-w-[1200px] mx-auto animate-fade-in key={location.pathname}">
            <div className="animate-slide-up duration-300">
              {children}
            </div>
          </div>
        </main>

        <Footer isSidebarCollapsed={isSidebarCollapsed} />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 sm:hidden z-50 shadow-lg">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-all duration-200",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon size={20} className={cn("transition-transform duration-200", location.pathname === item.path && "scale-110")} />
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
            {location.pathname === item.path && (
              <div className="absolute top-0 w-8 h-1 bg-primary rounded-full shadow-lg shadow-primary/40" />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};