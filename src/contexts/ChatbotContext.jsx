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
    // Initialize with demo data for joe@legallyinnovative.com
    const initDemoData = () => {
      // Check if user is logged in
      const currentUser = JSON.parse(localStorage.getItem('videobot_user'));
      
      // Only proceed if we have a user and no existing chatbots
      if (currentUser && currentUser.email === 'joe@legallyinnovative.com') {
        const savedBots = localStorage.getItem('videobot_chatbots');
        
        if (!savedBots || JSON.parse(savedBots).length === 0) {
          // Create pre-configured chatbots for the demo account
          const demoChatbots = [
            {
              id: 'bot1',
              name: 'Legal Aid Chatbot',
              video: null,
              welcomeMessage: 'Welcome to our legal aid center! How can we help you today?',
              email: 'support@legallyinnovative.com',
              phone: '+1 (555) 123-4567',
              chatEnabled: true,
              emailEnabled: true,
              phoneEnabled: true,
              volunteerEnabled: true,
              volunteerUrl: 'https://legallyinnovative.com/volunteer',
              donationEnabled: true,
              donationUrl: 'https://legallyinnovative.com/donate',
              donationAmounts: [25, 50, 100, 250],
              theme: {
                primaryColor: '#3b82f6',
                secondaryColor: '#f3f4f6',
                textColor: '#1f2937',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px'
              },
              position: 'bottom-right',
              size: 'medium',
              animation: 'bounce',
              showBranding: true,
              createdAt: new Date().toISOString()
            },
            {
              id: 'bot2',
              name: 'Pro Bono Services',
              video: null,
              welcomeMessage: 'Hello! Looking for pro bono legal assistance? Our team is here to help.',
              email: 'probono@legallyinnovative.com',
              phone: '+1 (555) 987-6543',
              chatEnabled: true,
              emailEnabled: true,
              phoneEnabled: true,
              volunteerEnabled: true,
              volunteerUrl: '',
              donationEnabled: true,
              donationUrl: '',
              donationAmounts: [50, 100, 250, 500],
              theme: {
                primaryColor: '#10b981',
                secondaryColor: '#f3f4f6',
                textColor: '#1f2937',
                borderRadius: '16px',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '14px'
              },
              position: 'bottom-left',
              size: 'large',
              animation: 'fade',
              showBranding: true,
              createdAt: new Date().toISOString()
            }
          ];
          
          localStorage.setItem('videobot_chatbots', JSON.stringify(demoChatbots));
          return demoChatbots;
        }
      }
      
      return null;
    };

    // Load saved chatbots or initialize with defaults
    const saved = localStorage.getItem('videobot_chatbots');
    const demoData = initDemoData();
    
    if (demoData) {
      setChatbots(demoData);
      setSelectedChatbot(demoData[0]);
    } else if (saved) {
      const parsedBots = JSON.parse(saved);
      setChatbots(parsedBots);
      if (parsedBots.length > 0) {
        setSelectedChatbot(parsedBots[0]);
      }
    } else {
      // Create default nonprofit chatbot
      const defaultBot = {
        id: '1',
        name: 'NPO Support Bot',
        video: null,
        welcomeMessage: 'Hello! How can we help you make a difference today?',
        email: 'support@npobot.org',
        phone: '+1 (555) 123-4567',
        chatEnabled: true,
        emailEnabled: true,
        phoneEnabled: true,
        volunteerEnabled: true,
        volunteerUrl: '',
        donationEnabled: true,
        donationUrl: '',
        donationAmounts: [25, 50, 100, 250],
        createdAt: new Date().toISOString()
      };
      setChatbots([defaultBot]);
      setSelectedChatbot(defaultBot);
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
      ...botData,
      volunteerEnabled: botData.volunteerEnabled || false,
      volunteerUrl: botData.volunteerUrl || '',
      donationEnabled: botData.donationEnabled || false,
      donationUrl: botData.donationUrl || '',
      donationAmounts: botData.donationAmounts || [25, 50, 100, 250],
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