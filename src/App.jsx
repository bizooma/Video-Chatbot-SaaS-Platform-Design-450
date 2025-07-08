import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ChatbotPreview from './components/ChatbotPreview';
import { AuthProvider } from './contexts/AuthContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ChatbotProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/preview/:botId" element={<ChatbotPreview />} />
            </Routes>
          </div>
        </Router>
      </ChatbotProvider>
    </AuthProvider>
  );
}

export default App;