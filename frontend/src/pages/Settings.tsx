import React, { useState } from 'react';
import { 
  User, 
  Palette, 
  Mail, 
  Bell, 
  Database, 
  Info, 
  Save, 
  Trash2, 
  Download,
  Check,
  AlertTriangle,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettings, UserSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const { clearAllData, leads, productContext } = useLeads();
  const { showToast } = useToast();

  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings(localSettings);
      setIsSaving(false);
      showToast('Your settings have been updated successfully.', 'success');
    }, 800);
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    showToast('All leads and campaign data have been cleared.', 'success');
  };

  const handleExportAll = () => {
    const data = {
      leads,
      productContext,
      settings
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leadpilot_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Your data is being prepared for download.', 'success');
  };

  const accentColors = [
    { name: 'blue', color: '#4f6ef7', label: 'Blue' },
    { name: 'purple', color: '#8b5cf6', label: 'Purple' },
    { name: 'green', color: '#10b981', label: 'Green' },
    { name: 'orange', color: '#f59e0b', label: 'Orange' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your profile, outreach defaults, and application preferences.</p>
      </div>

      {/* Profile Settings */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-subtle">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <User size={20} className="text-primary" />
          <h2 className="font-semibold text-foreground">Profile Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input 
                type="text" 
                value={localSettings.profile.fullName}
                onChange={(e) => setLocalSettings({
                  ...localSettings, 
                  profile: { ...localSettings.profile, fullName: e.target.value }
                })}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Shaheem"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input 
                type="email" 
                value={localSettings.profile.email}
                onChange={(e) => setLocalSettings({
                  ...localSettings, 
                  profile: { ...localSettings.profile, email: e.target.value }
                })}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="shaheem@leadpilot.ai"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Role</label>
              <select 
                value={localSettings.profile.role}
                onChange={(e) => setLocalSettings({
                  ...localSettings, 
                  profile: { ...localSettings.profile, role: e.target.value }
                })}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option>SDR</option>
                <option>AE</option>
                <option>Sales Manager</option>
                <option>VP Sales</option>
                <option>Founder</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <input 
                type="text" 
                value={localSettings.profile.companyName}
                onChange={(e) => setLocalSettings({
                  ...localSettings, 
                  profile: { ...localSettings.profile, companyName: e.target.value }
                })}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="LeadPilot AI"
              />
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            Save Profile
          </button>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-subtle">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <Palette size={20} className="text-primary" />
          <h2 className="font-semibold text-foreground">Appearance</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Switch between Light and Dark mode.</p>
            </div>
            <div className="flex bg-muted rounded-xl p-1">
              <button 
                onClick={() => theme === 'dark' && toggleTheme()}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                  theme === 'light' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun size={14} />
                Light
              </button>
              <button 
                onClick={() => theme === 'light' && toggleTheme()}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                  theme === 'dark' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon size={14} />
                Dark
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Accent Color</p>
              <p className="text-xs text-muted-foreground">Choose a primary color for the application.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setLocalSettings({
                    ...localSettings,
                    appearance: { ...localSettings.appearance, accentColor: color.name as any }
                  })}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2",
                    localSettings.appearance.accentColor === color.name 
                      ? "border-foreground scale-110 shadow-md" 
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color.color }}
                  title={color.label}
                >
                  {localSettings.appearance.accentColor === color.name && <Check size={20} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Compact Mode</p>
              <p className="text-xs text-muted-foreground">Reduces spacing to show more data on screen.</p>
            </div>
            <button 
              onClick={() => setLocalSettings({
                ...localSettings,
                appearance: { ...localSettings.appearance, compactMode: !localSettings.appearance.compactMode }
              })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                localSettings.appearance.compactMode ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                localSettings.appearance.compactMode ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>
        </div>
      </section>

      {/* Outreach Defaults */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-subtle">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <Mail size={20} className="text-primary" />
          <h2 className="font-semibold text-foreground">Outreach Defaults</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Default Tone</label>
              <select 
                value={localSettings.outreachDefaults.defaultTone}
                onChange={(e) => setLocalSettings({
                  ...localSettings, 
                  outreachDefaults: { ...localSettings.outreachDefaults, defaultTone: e.target.value }
                })}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option>Professional</option>
                <option>Conversational</option>
                <option>Bold</option>
                <option>Friendly</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Default CTA</label>
              <input 
                type="text" 
                value={localSettings.outreachDefaults.defaultCTA}
                onChange={(e) => setLocalSettings({
                  ...localSettings, 
                  outreachDefaults: { ...localSettings.outreachDefaults, defaultCTA: e.target.value }
                })}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Book a 15-min call"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Default Email Signature</label>
            <textarea 
              rows={4}
              value={localSettings.outreachDefaults.defaultEmailSignature}
              onChange={(e) => setLocalSettings({
                ...localSettings, 
                outreachDefaults: { ...localSettings.outreachDefaults, defaultEmailSignature: e.target.value }
              })}
              className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              placeholder="Your email signature..."
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Auto-generate outreach</p>
              <p className="text-xs text-muted-foreground">Automatically create outreach sequences when leads are enriched.</p>
            </div>
            <button 
              onClick={() => setLocalSettings({
                ...localSettings,
                outreachDefaults: { ...localSettings.outreachDefaults, autoGenerateOutreach: !localSettings.outreachDefaults.autoGenerateOutreach }
              })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                localSettings.outreachDefaults.autoGenerateOutreach ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                localSettings.outreachDefaults.autoGenerateOutreach ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-subtle">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <Bell size={20} className="text-primary" />
          <h2 className="font-semibold text-foreground">Notification Preferences</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Show toast notifications</p>
              <p className="text-xs text-muted-foreground">Display pop-up alerts for important actions.</p>
            </div>
            <button 
              onClick={() => setLocalSettings({
                ...localSettings,
                notifications: { ...localSettings.notifications, showToasts: !localSettings.notifications.showToasts }
              })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                localSettings.notifications.showToasts ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                localSettings.notifications.showToasts ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Sound on completion</p>
              <p className="text-xs text-muted-foreground">Play a subtle sound when tasks are finished.</p>
            </div>
            <button 
              onClick={() => setLocalSettings({
                ...localSettings,
                notifications: { ...localSettings.notifications, soundOnCompletion: !localSettings.notifications.soundOnCompletion }
              })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                localSettings.notifications.soundOnCompletion ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                localSettings.notifications.soundOnCompletion ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Auto-dismiss notifications after</p>
              <p className="text-xs text-muted-foreground">How long toasts stay on screen.</p>
            </div>
            <select 
              value={localSettings.notifications.autoDismissDelay}
              onChange={(e) => setLocalSettings({
                ...localSettings, 
                notifications: { ...localSettings.notifications, autoDismissDelay: parseInt(e.target.value) }
              })}
              className="px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            >
              <option value={3000}>3 seconds</option>
              <option value={5000}>5 seconds</option>
              <option value={10000}>10 seconds</option>
            </select>
          </div>
        </div>
      </section>

      {/* Data & Export */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-subtle">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <Database size={20} className="text-primary" />
          <h2 className="font-semibold text-foreground">Data & Export</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Default export format</p>
              <p className="text-xs text-muted-foreground">Choose your preferred file format for downloads.</p>
            </div>
            <div className="flex bg-muted rounded-xl p-1">
              {['CSV', 'JSON', 'Text'].map((format) => (
                <button 
                  key={format}
                  onClick={() => setLocalSettings({
                    ...localSettings,
                    dataExport: { ...localSettings.dataExport, defaultFormat: format as any }
                  })}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                    localSettings.dataExport.defaultFormat === format ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Include confidence scores in export</p>
              <p className="text-xs text-muted-foreground">Add enrichment and fit score data to your export files.</p>
            </div>
            <button 
              onClick={() => setLocalSettings({
                ...localSettings,
                dataExport: { ...localSettings.dataExport, includeConfidenceScores: !localSettings.dataExport.includeConfidenceScores }
              })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                localSettings.dataExport.includeConfidenceScores ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                localSettings.dataExport.includeConfidenceScores ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <button 
              onClick={handleExportAll}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-semibold transition-all border border-border"
            >
              <Download size={18} />
              Export All Data
            </button>
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl font-semibold transition-all border border-destructive/20"
            >
              <Trash2 size={18} />
              Clear All Data
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-subtle">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <Info size={20} className="text-primary" />
          <h2 className="font-semibold text-foreground">About</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <Sun size={32} className="text-white fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">LeadPilot AI <span className="text-sm font-normal text-muted-foreground ml-2">v1.0</span></h3>
              <p className="text-sm text-muted-foreground">Built on Mattr Platform</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                <Monitor size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Powered by AI Agents</p>
                <p className="text-xs text-muted-foreground">LeadGen-Enrichment, SDR-Outreach, Strategy-Advisor</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                <Database size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Knowledge Base</p>
                <p className="text-xs text-muted-foreground">B2B Sales Intelligence (RAG)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                <Database size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Database</p>
                <p className="text-xs text-muted-foreground">Supabase PostgreSQL</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                <Info size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Data Source</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AI-generated sample data based on ICP inputs. In production, this would connect to real B2B data providers like Apollo, ZoomInfo, or LinkedIn Sales Navigator via API integrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center text-destructive">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Reset Pipeline?</h3>
                <p className="text-muted-foreground">
                  This will permanently delete all your leads, enriched data, and outreach sequences. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClearData}
                  className="flex-1 px-4 py-2.5 bg-destructive text-white rounded-xl font-semibold hover:bg-destructive/90 transition-all shadow-lg shadow-destructive/20"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
