// Simulated API for chatbot data
// In production, this would be real API calls to your backend

export const getChatbotData = async (botId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get chatbot data from localStorage (simulating database)
  const chatbots = JSON.parse(localStorage.getItem('videobot_chatbots') || '[]');
  const chatbot = chatbots.find(bot => bot.id === botId);
  
  if (!chatbot) {
    throw new Error('Chatbot not found');
  }
  
  return {
    id: chatbot.id,
    name: chatbot.name,
    welcomeMessage: chatbot.welcomeMessage,
    video: chatbot.video,
    theme: chatbot.theme,
    position: chatbot.position,
    size: chatbot.size,
    animation: chatbot.animation,
    volunteerEnabled: chatbot.volunteerEnabled,
    donationEnabled: chatbot.donationEnabled,
    donationAmounts: chatbot.donationAmounts,
    emailEnabled: chatbot.emailEnabled,
    phoneEnabled: chatbot.phoneEnabled,
    email: chatbot.email,
    phone: chatbot.phone
  };
};

export const updateChatbotData = async (botId, updates) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Update chatbot data in localStorage (simulating database)
  const chatbots = JSON.parse(localStorage.getItem('videobot_chatbots') || '[]');
  const index = chatbots.findIndex(bot => bot.id === botId);
  
  if (index === -1) {
    throw new Error('Chatbot not found');
  }
  
  chatbots[index] = { ...chatbots[index], ...updates };
  localStorage.setItem('videobot_chatbots', JSON.stringify(chatbots));
  
  return chatbots[index];
};

export const logInteraction = async (botId, interactionType, data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Log interaction (in production, this would go to your analytics service)
  const interaction = {
    id: Date.now().toString(),
    botId,
    type: interactionType,
    data,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Store in localStorage for demo purposes
  const interactions = JSON.parse(localStorage.getItem('npo_bots_interactions') || '[]');
  interactions.push(interaction);
  localStorage.setItem('npo_bots_interactions', JSON.stringify(interactions));
  
  return interaction;
};