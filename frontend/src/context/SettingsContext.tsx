import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSettings {
  profile: {
    fullName: string;
    email: string;
    role: string;
    companyName: string;
  };
  appearance: {
    accentColor: 'blue' | 'purple' | 'green' | 'orange';
    compactMode: boolean;
  };
  outreachDefaults: {
    defaultTone: string;
    defaultEmailSignature: string;
    defaultCTA: string;
    autoGenerateOutreach: boolean;
  };
  notifications: {
    showToasts: boolean;
    soundOnCompletion: boolean;
    autoDismissDelay: number;
  };
  dataExport: {
    defaultFormat: 'CSV' | 'JSON' | 'Text';
    includeConfidenceScores: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    fullName: 'Shaheem',
    email: 'shaheem@leadpilot.ai',
    role: 'Founder',
    companyName: 'LeadPilot AI',
  },
  appearance: {
    accentColor: 'blue',
    compactMode: false,
  },
  outreachDefaults: {
    defaultTone: 'Professional',
    defaultEmailSignature: "--\nBest regards,\nShaheem\nFounder, LeadPilot AI",
    defaultCTA: 'Book a 15-min call',
    autoGenerateOutreach: true,
  },
  notifications: {
    showToasts: true,
    soundOnCompletion: true,
    autoDismissDelay: 5000,
  },
  dataExport: {
    defaultFormat: 'CSV',
    includeConfidenceScores: true,
  },
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('leadpilot_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('leadpilot_settings', JSON.stringify(settings));
    
    // Apply accent color to document root if needed
    // Assuming tailwind variables are used
    const root = document.documentElement;
    const colors = {
      blue: '#4f6ef7',
      purple: '#8b5cf6',
      green: '#10b981',
      orange: '#f59e0b',
    };
    root.style.setProperty('--primary', colors[settings.appearance.accentColor]);
    
    if (settings.appearance.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [settings]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
