import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [chatbots, setChatbots] = useState([]);
  const [selectedChatbot, setSelectedChatbot] = useState(null);

  useEffect(() => {
    // Load saved chatbots from localStorage
    const saved = localStorage.getItem('videobot_chatbots');
    if (saved) {
      const parsedBots = JSON.parse(saved);
      setChatbots(parsedBots);
      if (parsedBots.length > 0) {
        setSelectedChatbot(parsedBots[0]);
      }
    }
  }, []);

  const saveChatbots = (newChatbots) => {
    setChatbots(newChatbots);
    localStorage.setItem('videobot_chatbots', JSON.stringify(newChatbots));
  };

  const updateChatbot = (id, updates) => {
    const newChatbots = chatbots.map(bot => 
      bot.id === id ? { ...bot, ...updates } : bot
    );
    saveChatbots(newChatbots);
    
    if (selectedChatbot?.id === id) {
      setSelectedChatbot({ ...selectedChatbot, ...updates });
    }
  };

  const createChatbot = (botData) => {
    const newBot = {
      id: Date.now().toString(),
      name: botData.name || 'New Chatbot',
      video: null,
      welcomeMessage: botData.welcomeMessage || 'Hello! How can I help you today?',
      email: botData.email || '',
      phone: botData.phone || '',
      chatEnabled: botData.chatEnabled !== false,
      emailEnabled: botData.emailEnabled !== false,
      phoneEnabled: botData.phoneEnabled !== false,
      volunteerEnabled: botData.volunteerEnabled || false,
      volunteerUrl: botData.volunteerUrl || '',
      donationEnabled: botData.donationEnabled || false,
      donationUrl: botData.donationUrl || '',
      donationAmounts: botData.donationAmounts || [25, 50, 100, 250],
      theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#f3f4f6',
        textColor: '#1f2937',
        borderRadius: '12px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        ...botData.theme
      },
      position: botData.position || 'bottom-right',
      size: botData.size || 'medium',
      animation: botData.animation || 'bounce',
      showBranding: botData.showBranding !== false,
      customCSS: botData.customCSS || '',
      createdAt: new Date().toISOString()
    };
    
    saveChatbots([...chatbots, newBot]);
    return newBot;
  };

  const deleteChatbot = (id) => {
    const newChatbots = chatbots.filter(bot => bot.id !== id);
    saveChatbots(newChatbots);
    
    if (selectedChatbot?.id === id) {
      setSelectedChatbot(newChatbots[0] || null);
    }
  };

  const value = {
    chatbots,
    selectedChatbot,
    setSelectedChatbot,
    updateChatbot,
    createChatbot,
    deleteChatbot
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};