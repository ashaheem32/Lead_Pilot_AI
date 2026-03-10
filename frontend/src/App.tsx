import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LeadProvider } from './context/LeadContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { CampaignDashboard } from './pages/CampaignDashboard';
import { LeadFinder } from './pages/LeadFinder';
import { LeadEnrichment } from './pages/LeadEnrichment';
import { AIOutreach } from './pages/AIOutreach';
import { AIStrategyAdvisor } from './pages/AIStrategyAdvisor';

function App() {
  return (
    <ThemeProvider>
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
              </Routes>
            </Layout>
          </Router>
        </ToastProvider>
      </LeadProvider>
    </ThemeProvider>
  );
}

export default App;