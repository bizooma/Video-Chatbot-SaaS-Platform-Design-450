import React from 'react';
import {HashRouter as Router,Routes,Route} from 'react-router-dom';
import {QuestProvider} from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ChatbotPreview from './components/ChatbotPreview';
import ResetPassword from './components/ResetPassword';
import FeedbackButton from './components/FeedbackButton';
import {AuthProvider} from './contexts/AuthContext';
import {ChatbotProvider} from './contexts/ChatbotContext';
import questConfig from './questConfig';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ChatbotProvider>
        <QuestProvider
          apiKey={questConfig.APIKEY}
          entityId={questConfig.ENTITYID}
          apiType="PRODUCTION"
        >
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/preview/:botId" element={<ChatbotPreview />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
              <FeedbackButton />
            </div>
          </Router>
        </QuestProvider>
      </ChatbotProvider>
    </AuthProvider>
  );
}

export default App;