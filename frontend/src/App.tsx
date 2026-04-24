import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LeadProvider } from './context/LeadContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { Layout } from './components/Layout';
import { CampaignDashboard } from './pages/CampaignDashboard';
import { LeadFinder } from './pages/LeadFinder';
import { LeadEnrichment } from './pages/LeadEnrichment';
import { AIOutreach } from './pages/AIOutreach';
import { AIStrategyAdvisor } from './pages/AIStrategyAdvisor';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <LeadProvider>
          <ToastProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<CampaignDashboard />} />
                  <Route path="/finder" element={<LeadFinder />} />
                  <Route path="/enrichment" element={<LeadEnrichment />} />
                  <Route path="/outreach" element={<AIOutreach />} />
                  <Route path="/advisor" element={<AIStrategyAdvisor />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </Router>
          </ToastProvider>
        </LeadProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;