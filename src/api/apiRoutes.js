// API routes for the NPO Bots platform

// Base API URL - change this based on environment
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.npobots.com' 
  : 'http://localhost:3000/api';

// Chatbot API routes
export const CHATBOT_API = {
  // Get chatbot data
  GET_CHATBOT: (botId) => `${API_BASE_URL}/chatbot/${botId}`,
  
  // Update chatbot
  UPDATE_CHATBOT: (botId) => `${API_BASE_URL}/chatbot/${botId}`,
  
  // Process chat message
  PROCESS_CHAT: `${API_BASE_URL}/chat`,
  
  // Volunteer signup
  VOLUNTEER_SIGNUP: `${API_BASE_URL}/volunteer`,
  
  // Contact form
  CONTACT_FORM: `${API_BASE_URL}/contact`,
  
  // Analytics tracking
  TRACK_EVENT: `${API_BASE_URL}/track`,
  
  // AI training
  TRAIN_CHATBOT: (botId) => `${API_BASE_URL}/train/${botId}`,
  
  // Widget embed code
  WIDGET_CODE: (botId) => `${API_BASE_URL}/widget/${botId}/code`
};

// User API routes
export const USER_API = {
  // User authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  
  // User profile
  GET_PROFILE: `${API_BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
  
  // Subscription management
  GET_SUBSCRIPTION: `${API_BASE_URL}/user/subscription`,
  UPDATE_SUBSCRIPTION: `${API_BASE_URL}/user/subscription`,
  CANCEL_SUBSCRIPTION: `${API_BASE_URL}/user/subscription/cancel`
};

// Analytics API routes
export const ANALYTICS_API = {
  // Dashboard analytics
  GET_OVERVIEW: (botId, timeRange) => 
    `${API_BASE_URL}/analytics/${botId}/overview?timeRange=${timeRange}`,
  
  // Detailed analytics
  GET_INTERACTIONS: (botId, timeRange) => 
    `${API_BASE_URL}/analytics/${botId}/interactions?timeRange=${timeRange}`,
  
  // Volunteer data
  GET_VOLUNTEERS: (botId) => 
    `${API_BASE_URL}/analytics/${botId}/volunteers`,
  
  // Donation data
  GET_DONATIONS: (botId, timeRange) => 
    `${API_BASE_URL}/analytics/${botId}/donations?timeRange=${timeRange}`,
  
  // Export data
  EXPORT_DATA: (botId, format) => 
    `${API_BASE_URL}/analytics/${botId}/export?format=${format}`
};