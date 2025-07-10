// Enhanced Google Analytics utility functions
export const trackEvent = (eventName, parameters = {}) => {
  // Check if window and gtag exist before using them
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, {
      event_category: parameters.category || 'general',
      event_label: parameters.label,
      value: parameters.value,
      ...parameters
    });
  } else {
    console.log('Analytics event (development):', eventName, parameters);
  }
};

// Specific tracking functions for NPO Bots
export const trackSignup = (method = 'email') => {
  trackEvent('sign_up', {
    method: method,
    category: 'authentication'
  });
};

export const trackLogin = (method = 'email') => {
  trackEvent('login', {
    method: method,
    category: 'authentication'
  });
};

export const trackChatbotCreated = (chatbotType = 'basic') => {
  trackEvent('chatbot_created', {
    category: 'chatbot',
    label: chatbotType
  });
};

export const trackVideoUpload = (fileSize, duration) => {
  trackEvent('video_upload', {
    category: 'content',
    label: 'video',
    custom_parameters: {
      file_size: fileSize,
      duration: duration
    }
  });
};

export const trackDemoInteraction = (interactionType) => {
  trackEvent('demo_interaction', {
    category: 'demo',
    label: interactionType
  });
};

export const trackPricingView = (plan) => {
  trackEvent('view_item', {
    category: 'pricing',
    item_id: plan,
    item_name: `${plan} Plan`,
    item_category: 'subscription'
  });
};

export const trackPurchaseIntent = (plan, amount) => {
  trackEvent('begin_checkout', {
    category: 'ecommerce',
    currency: 'USD',
    value: amount,
    items: [{
      item_id: plan,
      item_name: `${plan} Plan`,
      item_category: 'subscription',
      price: amount,
      quantity: 1
    }]
  });
};

export const trackContactForm = (formType) => {
  trackEvent('contact_form_submit', {
    category: 'lead_generation',
    label: formType
  });
};

export const trackVolunteerSignup = () => {
  trackEvent('volunteer_signup', {
    category: 'conversion',
    label: 'volunteer'
  });
};

// Page view tracking for SPA
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-JTP2KQ19VN', {
      page_path: pagePath,
      page_title: pageTitle
    });
  } else {
    console.log('Page view (development):', pagePath, pageTitle);
  }
};