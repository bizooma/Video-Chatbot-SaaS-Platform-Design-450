// Real API integration for chatbot data
import supabase from '../lib/supabase';

// Fetch chatbot data from Supabase
export const getChatbotData = async (botId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get chatbot data from Supabase
    const { data, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', botId)
      .single();
      
    if (error) {
      console.error('Error fetching chatbot data:', error);
      // Fallback to localStorage for development
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
        phone: chatbot.phone,
        isAiTrained: chatbot.isAiTrained || false
      };
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get chatbot data:', error);
    throw error;
  }
};

// Update chatbot data in Supabase
export const updateChatbotData = async (botId, updates) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Update chatbot in Supabase
    const { data, error } = await supabase
      .from('chatbots')
      .update(updates)
      .eq('id', botId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating chatbot data:', error);
      // Fallback to localStorage for development
      const chatbots = JSON.parse(localStorage.getItem('videobot_chatbots') || '[]');
      const index = chatbots.findIndex(bot => bot.id === botId);
      
      if (index === -1) {
        throw new Error('Chatbot not found');
      }
      
      chatbots[index] = { ...chatbots[index], ...updates };
      localStorage.setItem('videobot_chatbots', JSON.stringify(chatbots));
      
      return chatbots[index];
    }
    
    return data;
  } catch (error) {
    console.error('Failed to update chatbot data:', error);
    throw error;
  }
};

// Process chat message with AI
export const processChatMessage = async (botId, message, sessionId) => {
  try {
    // API endpoint for chat processing
    const { data, error } = await supabase.functions.invoke('process-chat', {
      body: {
        botId,
        message,
        sessionId
      }
    });
    
    if (error) {
      console.error('Error processing chat message:', error);
      throw new Error('Failed to process message');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to process chat message:', error);
    // Fallback response
    return {
      response: "I'm having trouble connecting to my brain right now. Please try again later or contact support directly.",
      success: false,
      error: error.message
    };
  }
};

// Log interactions for analytics
export const logInteraction = async (botId, interactionType, data) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Log interaction to Supabase
    const { data: interactionData, error } = await supabase
      .from('chatbot_interactions')
      .insert([
        {
          bot_id: botId,
          type: interactionType,
          data,
          user_agent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer,
          timestamp: new Date().toISOString()
        }
      ])
      .select()
      .single();
      
    if (error) {
      console.error('Error logging interaction:', error);
      // Fallback to localStorage for development
      const interactions = JSON.parse(localStorage.getItem('npo_bots_interactions') || '[]');
      const interaction = {
        id: Date.now().toString(),
        botId,
        type: interactionType,
        data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      interactions.push(interaction);
      localStorage.setItem('npo_bots_interactions', JSON.stringify(interactions));
      
      return interaction;
    }
    
    return interactionData;
  } catch (error) {
    console.error('Failed to log interaction:', error);
    // Still return success to prevent blocking user experience
    return { success: true };
  }
};