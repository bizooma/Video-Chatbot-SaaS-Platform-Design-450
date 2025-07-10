(function() {
  'use strict';
  
  // NPO Bots Widget Script
  const NPOBots = {
    config: null,
    widget: null,
    isOpen: false,
    messages: [],
    isLoading: false,
    botData: null,
    
    init: function() {
      // Get configuration from the page
      this.config = window.NPOBotsConfig;
      
      if (!this.config || !this.config.botId) {
        console.error('NPO Bots: Missing configuration');
        return;
      }
      
      // Initialize with loading state
      this.isLoading = true;
      
      // Load styles and create widget structure
      this.loadStyles();
      this.createWidget();
      this.bindEvents();
      
      // Fetch the chatbot data from API
      this.fetchBotData();
      
      // Track widget load
      this.trackEvent('widget_loaded');
    },
    
    loadStyles: function() {
      // Default theme settings
      const theme = this.config.theme || {
        primaryColor: '#3b82f6',
        secondaryColor: '#f3f4f6',
        textColor: '#1f2937',
        borderRadius: '12px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '14px'
      };
      
      const styles = `
        .npo-bots-widget {
          position: fixed;
          z-index: 9999;
          font-family: ${theme.fontFamily};
          font-size: ${theme.fontSize};
        }
        
        .npo-bots-widget.bottom-right {
          bottom: 20px;
          right: 20px;
        }
        
        .npo-bots-widget.bottom-left {
          bottom: 20px;
          left: 20px;
        }
        
        .npo-bots-widget.top-right {
          top: 20px;
          right: 20px;
        }
        
        .npo-bots-widget.top-left {
          top: 20px;
          left: 20px;
        }
        
        .npo-bots-toggle {
          width: 60px;
          height: 60px;
          border-radius: ${theme.borderRadius};
          background: ${theme.primaryColor};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .npo-bots-toggle:hover {
          transform: scale(1.1);
        }
        
        .npo-bots-toggle-icon {
          color: white;
          font-size: 24px;
          transition: all 0.3s ease;
        }
        
        .npo-bots-toggle-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .npo-bots-chat {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: ${theme.borderRadius};
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: none;
          flex-direction: column;
          overflow: hidden;
        }
        
        .npo-bots-chat.open {
          display: flex;
        }
        
        .npo-bots-header {
          background: ${theme.primaryColor};
          color: white;
          padding: 16px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .npo-bots-header-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
        }
        
        .npo-bots-video-container {
          position: relative;
          width: 100%;
          height: 150px;
          background: black;
          overflow: hidden;
        }
        
        .npo-bots-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .npo-bots-video-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.3);
          cursor: pointer;
        }
        
        .npo-bots-video-play {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111;
          font-size: 20px;
        }
        
        .npo-bots-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f9fafb;
        }
        
        .npo-bots-message-container {
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
        }
        
        .npo-bots-message {
          padding: 8px 12px;
          border-radius: 8px;
          max-width: 80%;
          word-wrap: break-word;
        }
        
        .npo-bots-message.bot {
          background: #e5e7eb;
          color: #374151;
          align-self: flex-start;
          border-bottom-left-radius: 2px;
        }
        
        .npo-bots-message.user {
          background: ${theme.primaryColor};
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 2px;
        }
        
        .npo-bots-typing {
          display: flex;
          align-items: center;
          margin-top: 4px;
        }
        
        .npo-bots-typing-dot {
          width: 8px;
          height: 8px;
          background: ${theme.primaryColor};
          border-radius: 50%;
          margin: 0 2px;
          opacity: 0.6;
          animation: npo-bots-typing 1s infinite;
        }
        
        .npo-bots-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .npo-bots-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes npo-bots-typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        .npo-bots-input {
          display: flex;
          padding: 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }
        
        .npo-bots-input input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          outline: none;
        }
        
        .npo-bots-input input:focus {
          border-color: ${theme.primaryColor};
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        
        .npo-bots-input button {
          margin-left: 8px;
          padding: 8px 16px;
          background: ${theme.primaryColor};
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        
        .npo-bots-input button:hover {
          opacity: 0.9;
        }
        
        .npo-bots-actions {
          padding: 16px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        
        .npo-bots-action-btn {
          width: 100%;
          padding: 12px;
          margin-bottom: 8px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .npo-bots-volunteer {
          background: #10b981;
          color: white;
        }
        
        .npo-bots-volunteer:hover {
          background: #059669;
        }
        
        .npo-bots-donate {
          background: #ef4444;
          color: white;
        }
        
        .npo-bots-donate:hover {
          background: #dc2626;
        }
        
        .npo-bots-contact {
          background: #6366f1;
          color: white;
        }
        
        .npo-bots-contact:hover {
          background: #4f46e5;
        }
        
        .npo-bots-donation-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        
        .npo-bots-volunteer-form, 
        .npo-bots-contact-form {
          padding: 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }
        
        .npo-bots-form-field {
          margin-bottom: 12px;
        }
        
        .npo-bots-form-field label {
          display: block;
          margin-bottom: 4px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }
        
        .npo-bots-form-field input, 
        .npo-bots-form-field textarea, 
        .npo-bots-form-field select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .npo-bots-form-field input:focus, 
        .npo-bots-form-field textarea:focus, 
        .npo-bots-form-field select:focus {
          border-color: ${theme.primaryColor};
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        
        .npo-bots-form-submit {
          width: 100%;
          padding: 10px;
          background: ${theme.primaryColor};
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .npo-bots-form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .npo-bots-form-submit:hover:not(:disabled) {
          opacity: 0.9;
        }
        
        .npo-bots-success {
          padding: 16px;
          background: #ecfdf5;
          border: 1px solid #10b981;
          border-radius: 6px;
          color: #065f46;
          margin-bottom: 16px;
        }
        
        .npo-bots-error {
          padding: 16px;
          background: #fef2f2;
          border: 1px solid #ef4444;
          border-radius: 6px;
          color: #991b1b;
          margin-bottom: 16px;
        }
        
        .npo-bots-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
        }
        
        .npo-bots-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          border-top-color: ${theme.primaryColor};
          animation: npo-bots-spin 1s linear infinite;
        }
        
        @keyframes npo-bots-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .npo-bots-branding {
          text-align: center;
          font-size: 11px;
          color: #9ca3af;
          padding: 8px;
          border-top: 1px solid #e5e7eb;
        }
        
        .npo-bots-branding a {
          color: #6b7280;
          text-decoration: none;
        }
        
        .npo-bots-branding a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 480px) {
          .npo-bots-chat {
            width: 300px;
          }
        }
        
        ${this.config.customCSS || ''}
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    },
    
    createWidget: function() {
      this.widget = document.createElement('div');
      this.widget.className = `npo-bots-widget ${this.config.position || 'bottom-right'}`;
      this.widget.innerHTML = `
        <div class="npo-bots-chat" id="npo-bots-chat">
          <div class="npo-bots-header">
            <div id="npo-bots-title">Loading...</div>
            <button class="npo-bots-header-close" onclick="NPOBots.toggle()">×</button>
          </div>
          <div id="npo-bots-video-container"></div>
          <div class="npo-bots-messages" id="npo-bots-messages">
            <div class="npo-bots-loading">
              <div class="npo-bots-spinner"></div>
            </div>
          </div>
          <div class="npo-bots-input" id="npo-bots-input-container" style="display:none">
            <input type="text" id="npo-bots-input" placeholder="Type your message...">
            <button onclick="NPOBots.sendMessage()">Send</button>
          </div>
          <div class="npo-bots-actions" id="npo-bots-actions"></div>
          <div id="npo-bots-volunteer-form" class="npo-bots-volunteer-form" style="display:none"></div>
          <div id="npo-bots-contact-form" class="npo-bots-contact-form" style="display:none"></div>
          <div id="npo-bots-branding" class="npo-bots-branding" style="display:none">
            Powered by <a href="https://npobots.com" target="_blank">NPO Bots</a>
          </div>
        </div>
        <button class="npo-bots-toggle" onclick="NPOBots.toggle()">
          <span class="npo-bots-toggle-icon">💬</span>
        </button>
      `;
      
      document.body.appendChild(this.widget);
    },
    
    bindEvents: function() {
      const input = document.getElementById('npo-bots-input');
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.sendMessage();
          }
        });
      }
      
      // Close widget when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.widget.contains(e.target)) {
          this.toggle();
        }
      });
    },
    
    fetchBotData: function() {
      // Get API URL from config
      const apiUrl = this.config.apiUrl || `https://api.npobots.com/chatbot/${this.config.botId}`;
      
      // Fetch chatbot data
      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        this.botData = data;
        this.updateWidget(data);
        this.isLoading = false;
        this.trackEvent('widget_data_loaded');
      })
      .catch(error => {
        console.error('Error fetching chatbot data:', error);
        // Fallback to default data
        this.updateWidget({
          name: 'Support Bot',
          welcomeMessage: 'Hello! How can I help you today?',
          volunteerEnabled: true,
          donationEnabled: true,
          donationAmounts: [25, 50, 100, 250],
          emailEnabled: true,
          phoneEnabled: true,
          email: this.config.email || 'support@npobots.com',
          phone: this.config.phone || '+1-555-123-4567',
          chatEnabled: true,
          showBranding: true
        });
        this.isLoading = false;
        this.trackEvent('widget_data_error', { error: error.message });
      });
    },
    
    updateWidget: function(botData) {
      // Update title
      document.getElementById('npo-bots-title').textContent = botData.name;
      
      // Clear loading state
      document.getElementById('npo-bots-messages').innerHTML = '';
      
      // Add welcome message
      this.addMessage(botData.welcomeMessage, 'bot');
      
      // Show input if chat is enabled
      if (botData.chatEnabled) {
        document.getElementById('npo-bots-input-container').style.display = 'flex';
      }
      
      // Add video if available
      if (botData.video) {
        this.addVideo(botData.video);
      }
      
      // Add action buttons
      const actionsContainer = document.getElementById('npo-bots-actions');
      actionsContainer.innerHTML = '';
      
      // Volunteer button
      if (botData.volunteerEnabled) {
        const volunteerBtn = document.createElement('button');
        volunteerBtn.className = 'npo-bots-action-btn npo-bots-volunteer';
        volunteerBtn.textContent = 'I Want to Volunteer';
        volunteerBtn.onclick = () => this.handleVolunteer();
        actionsContainer.appendChild(volunteerBtn);
      }
      
      // Donation buttons
      if (botData.donationEnabled && botData.donationAmounts && botData.donationAmounts.length > 0) {
        const donateContainer = document.createElement('div');
        donateContainer.innerHTML = '<div style="margin-bottom: 8px; font-weight: 500;">Quick Donation:</div>';
        
        const donateGrid = document.createElement('div');
        donateGrid.className = 'npo-bots-donation-grid';
        
        botData.donationAmounts.forEach(amount => {
          const donateBtn = document.createElement('button');
          donateBtn.className = 'npo-bots-action-btn npo-bots-donate';
          donateBtn.textContent = `$${amount}`;
          donateBtn.onclick = () => this.handleDonation(amount);
          donateGrid.appendChild(donateBtn);
        });
        
        donateContainer.appendChild(donateGrid);
        actionsContainer.appendChild(donateContainer);
      }
      
      // Contact buttons
      if (botData.emailEnabled || botData.phoneEnabled) {
        const contactContainer = document.createElement('div');
        contactContainer.style.display = 'flex';
        contactContainer.style.gap = '8px';
        contactContainer.style.marginTop = '8px';
        
        if (botData.emailEnabled) {
          const emailBtn = document.createElement('button');
          emailBtn.className = 'npo-bots-action-btn npo-bots-contact';
          emailBtn.textContent = 'Email';
          emailBtn.style.flex = '1';
          emailBtn.onclick = () => this.handleEmail();
          contactContainer.appendChild(emailBtn);
        }
        
        if (botData.phoneEnabled) {
          const phoneBtn = document.createElement('button');
          phoneBtn.className = 'npo-bots-action-btn npo-bots-contact';
          phoneBtn.textContent = 'Call';
          phoneBtn.style.flex = '1';
          phoneBtn.onclick = () => this.handlePhone();
          contactContainer.appendChild(phoneBtn);
        }
        
        actionsContainer.appendChild(contactContainer);
      }
      
      // Show branding if enabled
      if (botData.showBranding !== false) {
        document.getElementById('npo-bots-branding').style.display = 'block';
      }
    },
    
    addVideo: function(videoUrl) {
      const videoContainer = document.getElementById('npo-bots-video-container');
      videoContainer.className = 'npo-bots-video-container';
      
      const video = document.createElement('video');
      video.className = 'npo-bots-video';
      video.src = videoUrl;
      video.muted = true;
      video.id = 'npo-bots-video';
      
      const overlay = document.createElement('div');
      overlay.className = 'npo-bots-video-overlay';
      overlay.innerHTML = '<div class="npo-bots-video-play">▶</div>';
      overlay.onclick = () => this.toggleVideo();
      
      videoContainer.appendChild(video);
      videoContainer.appendChild(overlay);
    },
    
    toggleVideo: function() {
      const video = document.getElementById('npo-bots-video');
      const overlay = video.nextElementSibling;
      
      if (video.paused) {
        video.play();
        overlay.style.opacity = '0';
        this.trackEvent('video_play');
      } else {
        video.pause();
        overlay.style.opacity = '1';
        this.trackEvent('video_pause');
      }
    },
    
    toggle: function() {
      const chat = document.getElementById('npo-bots-chat');
      this.isOpen = !this.isOpen;
      chat.classList.toggle('open', this.isOpen);
      
      if (this.isOpen) {
        this.trackEvent('widget_open');
      } else {
        this.trackEvent('widget_close');
        
        // Reset forms
        this.hideVolunteerForm();
        this.hideContactForm();
      }
    },
    
    sendMessage: function() {
      const input = document.getElementById('npo-bots-input');
      const message = input.value.trim();
      
      if (!message) return;
      
      this.addMessage(message, 'user');
      input.value = '';
      
      this.trackEvent('message_sent', { message_length: message.length });
      
      // Show typing indicator
      this.showTypingIndicator();
      
      // If AI is trained, send to AI API
      if (this.botData.isAiTrained) {
        this.sendToAI(message);
      } else {
        // Simulate bot response for non-AI bots
        setTimeout(() => {
          this.hideTypingIndicator();
          this.addMessage('Thanks for your message! Our team will get back to you soon.', 'bot');
        }, 1500);
      }
    },
    
    sendToAI: function(message) {
      const apiUrl = `${this.config.apiUrl || 'https://api.npobots.com'}/chat`;
      
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          botId: this.config.botId,
          message: message,
          sessionId: this.getSessionId()
        })
      })
      .then(response => response.json())
      .then(data => {
        this.hideTypingIndicator();
        if (data.response) {
          this.addMessage(data.response, 'bot');
          this.trackEvent('ai_response_received');
        } else {
          throw new Error('No response from AI');
        }
      })
      .catch(error => {
        console.error('AI chat error:', error);
        this.hideTypingIndicator();
        this.addMessage('I apologize, but I\'m having trouble connecting right now. Please try again later or use one of the contact options below.', 'bot');
        this.trackEvent('ai_response_error', { error: error.message });
      });
    },
    
    showTypingIndicator: function() {
      const messagesContainer = document.getElementById('npo-bots-messages');
      const typingDiv = document.createElement('div');
      typingDiv.id = 'npo-bots-typing';
      typingDiv.className = 'npo-bots-typing';
      typingDiv.innerHTML = `
        <div class="npo-bots-message bot" style="padding: 8px 16px;">
          <div style="display: flex; align-items: center;">
            <div class="npo-bots-typing-dot"></div>
            <div class="npo-bots-typing-dot"></div>
            <div class="npo-bots-typing-dot"></div>
          </div>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    hideTypingIndicator: function() {
      const typingIndicator = document.getElementById('npo-bots-typing');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    },
    
    addMessage: function(text, sender) {
      const messagesContainer = document.getElementById('npo-bots-messages');
      
      // Create message container
      const messageContainer = document.createElement('div');
      messageContainer.className = 'npo-bots-message-container';
      
      // Create message element
      const messageDiv = document.createElement('div');
      messageDiv.className = `npo-bots-message ${sender}`;
      
      // Process text (handle links, emojis, etc.)
      messageDiv.innerHTML = this.processMessageText(text);
      
      // Add to container
      messageContainer.appendChild(messageDiv);
      messagesContainer.appendChild(messageContainer);
      
      // Save message to history
      this.messages.push({
        text: text,
        sender: sender,
        timestamp: new Date().toISOString()
      });
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Track event
      if (sender === 'bot') {
        this.trackEvent('message_received', { message_length: text.length });
      }
    },
    
    processMessageText: function(text) {
      // Convert URLs to clickable links
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const processedText = text.replace(urlRegex, url => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">${url}</a>`;
      });
      
      return processedText;
    },
    
    handleVolunteer: function() {
      // Track event
      this.trackEvent('volunteer_button_click');
      
      // If URL is defined, navigate to it
      if (this.botData.volunteerUrl) {
        window.open(this.botData.volunteerUrl, '_blank');
        this.addMessage('🙋‍♀️ Opening volunteer sign-up page...', 'bot');
        return;
      }
      
      // Otherwise show volunteer form
      this.showVolunteerForm();
    },
    
    showVolunteerForm: function() {
      // Hide actions
      document.getElementById('npo-bots-actions').style.display = 'none';
      
      // Show volunteer form
      const formContainer = document.getElementById('npo-bots-volunteer-form');
      formContainer.style.display = 'block';
      formContainer.innerHTML = `
        <h3 style="font-weight: 600; margin-bottom: 12px;">Volunteer Sign-Up</h3>
        <div id="npo-bots-volunteer-form-result"></div>
        <form id="npo-bots-volunteer-form-element">
          <div class="npo-bots-form-field">
            <label for="npo-bots-volunteer-name">Full Name</label>
            <input type="text" id="npo-bots-volunteer-name" required>
          </div>
          <div class="npo-bots-form-field">
            <label for="npo-bots-volunteer-email">Email</label>
            <input type="email" id="npo-bots-volunteer-email" required>
          </div>
          <div class="npo-bots-form-field">
            <label for="npo-bots-volunteer-phone">Phone (Optional)</label>
            <input type="tel" id="npo-bots-volunteer-phone">
          </div>
          <div class="npo-bots-form-field">
            <label for="npo-bots-volunteer-days">Available Days</label>
            <select id="npo-bots-volunteer-days">
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Both">Both Weekdays & Weekends</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button type="submit" class="npo-bots-form-submit" id="npo-bots-volunteer-submit">Submit</button>
            <button type="button" onclick="NPOBots.hideVolunteerForm()" style="flex: 1; padding: 10px; background: #f3f4f6; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>
          </div>
        </form>
      `;
      
      // Add form submission handler
      document.getElementById('npo-bots-volunteer-form-element').addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitVolunteerForm();
      });
    },
    
    hideVolunteerForm: function() {
      // Show actions
      document.getElementById('npo-bots-actions').style.display = 'block';
      
      // Hide volunteer form
      document.getElementById('npo-bots-volunteer-form').style.display = 'none';
    },
    
    submitVolunteerForm: function() {
      const name = document.getElementById('npo-bots-volunteer-name').value;
      const email = document.getElementById('npo-bots-volunteer-email').value;
      const phone = document.getElementById('npo-bots-volunteer-phone').value;
      const availableDays = document.getElementById('npo-bots-volunteer-days').value;
      
      // Disable submit button
      const submitButton = document.getElementById('npo-bots-volunteer-submit');
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
      
      // Track form submission attempt
      this.trackEvent('volunteer_form_submit', { has_phone: !!phone });
      
      // API endpoint
      const apiUrl = `${this.config.apiUrl || 'https://api.npobots.com'}/volunteer`;
      
      // Submit to API
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          botId: this.config.botId,
          name,
          email,
          phone,
          availableDays
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Show success message
          document.getElementById('npo-bots-volunteer-form-result').innerHTML = `
            <div class="npo-bots-success">
              <strong>Thank you for volunteering!</strong><br>
              We'll be in touch with you soon.
            </div>
          `;
          
          // Add message to chat
          this.addMessage('🙋‍♀️ Thank you for volunteering! We\'ll be in touch with you soon about volunteer opportunities.', 'bot');
          
          // Reset form
          document.getElementById('npo-bots-volunteer-form-element').reset();
          
          // Hide form after delay
          setTimeout(() => {
            this.hideVolunteerForm();
          }, 3000);
          
          // Track success
          this.trackEvent('volunteer_form_success');
        } else {
          throw new Error(data.message || 'Form submission failed');
        }
      })
      .catch(error => {
        console.error('Volunteer form submission error:', error);
        
        // Show error message
        document.getElementById('npo-bots-volunteer-form-result').innerHTML = `
          <div class="npo-bots-error">
            <strong>Submission failed.</strong><br>
            Please try again or contact us directly.
          </div>
        `;
        
        // Track error
        this.trackEvent('volunteer_form_error', { error: error.message });
      })
      .finally(() => {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
      });
    },
    
    handleDonation: function(amount) {
      // Track event
      this.trackEvent('donation_button_click', { amount });
      
      // If donation URL is defined, navigate to it with amount parameter
      if (this.botData.donationUrl) {
        const url = this.botData.donationUrl.includes('?') 
          ? `${this.botData.donationUrl}&amount=${amount}` 
          : `${this.botData.donationUrl}?amount=${amount}`;
        
        window.open(url, '_blank');
        this.addMessage(`❤️ Opening donation page for $${amount}...`, 'bot');
      } else {
        // Fallback message
        this.addMessage(`❤️ Thank you for your generous $${amount} donation! This will make a real difference in our mission.`, 'bot');
      }
    },
    
    handleEmail: function() {
      // Track event
      this.trackEvent('email_button_click');
      
      // If email is defined, show contact form
      if (this.botData.email) {
        this.showContactForm();
      } else {
        // Fallback to mailto
        window.location.href = 'mailto:support@npobots.com';
        this.addMessage('📧 Opening email client...', 'bot');
      }
    },
    
    showContactForm: function() {
      // Hide actions
      document.getElementById('npo-bots-actions').style.display = 'none';
      
      // Show contact form
      const formContainer = document.getElementById('npo-bots-contact-form');
      formContainer.style.display = 'block';
      formContainer.innerHTML = `
        <h3 style="font-weight: 600; margin-bottom: 12px;">Contact Us</h3>
        <div id="npo-bots-contact-form-result"></div>
        <form id="npo-bots-contact-form-element">
          <div class="npo-bots-form-field">
            <label for="npo-bots-contact-name">Full Name</label>
            <input type="text" id="npo-bots-contact-name" required>
          </div>
          <div class="npo-bots-form-field">
            <label for="npo-bots-contact-email">Email</label>
            <input type="email" id="npo-bots-contact-email" required>
          </div>
          <div class="npo-bots-form-field">
            <label for="npo-bots-contact-message">Message</label>
            <textarea id="npo-bots-contact-message" rows="4" required></textarea>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button type="submit" class="npo-bots-form-submit" id="npo-bots-contact-submit">Send Message</button>
            <button type="button" onclick="NPOBots.hideContactForm()" style="flex: 1; padding: 10px; background: #f3f4f6; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>
          </div>
        </form>
      `;
      
      // Add form submission handler
      document.getElementById('npo-bots-contact-form-element').addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitContactForm();
      });
    },
    
    hideContactForm: function() {
      // Show actions
      document.getElementById('npo-bots-actions').style.display = 'block';
      
      // Hide contact form
      document.getElementById('npo-bots-contact-form').style.display = 'none';
    },
    
    submitContactForm: function() {
      const name = document.getElementById('npo-bots-contact-name').value;
      const email = document.getElementById('npo-bots-contact-email').value;
      const message = document.getElementById('npo-bots-contact-message').value;
      
      // Disable submit button
      const submitButton = document.getElementById('npo-bots-contact-submit');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      // Track form submission attempt
      this.trackEvent('contact_form_submit', { message_length: message.length });
      
      // API endpoint
      const apiUrl = `${this.config.apiUrl || 'https://api.npobots.com'}/contact`;
      
      // Submit to API
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          botId: this.config.botId,
          name,
          email,
          message,
          recipientEmail: this.botData.email
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Show success message
          document.getElementById('npo-bots-contact-form-result').innerHTML = `
            <div class="npo-bots-success">
              <strong>Message sent successfully!</strong><br>
              We'll get back to you as soon as possible.
            </div>
          `;
          
          // Add message to chat
          this.addMessage('📧 Thank you for your message! We\'ll get back to you soon.', 'bot');
          
          // Reset form
          document.getElementById('npo-bots-contact-form-element').reset();
          
          // Hide form after delay
          setTimeout(() => {
            this.hideContactForm();
          }, 3000);
          
          // Track success
          this.trackEvent('contact_form_success');
        } else if (data.mailtoLink) {
          // Fallback to mailto
          window.location.href = data.mailtoLink;
          this.hideContactForm();
          this.addMessage('📧 Opening email client...', 'bot');
        } else {
          throw new Error(data.message || 'Form submission failed');
        }
      })
      .catch(error => {
        console.error('Contact form submission error:', error);
        
        // Show error message
        document.getElementById('npo-bots-contact-form-result').innerHTML = `
          <div class="npo-bots-error">
            <strong>Message sending failed.</strong><br>
            Please try again or email us directly at ${this.botData.email}.
          </div>
        `;
        
        // Track error
        this.trackEvent('contact_form_error', { error: error.message });
      })
      .finally(() => {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      });
    },
    
    handlePhone: function() {
      // Track event
      this.trackEvent('phone_button_click');
      
      // If phone is defined, use it
      if (this.botData.phone) {
        window.location.href = `tel:${this.botData.phone}`;
        this.addMessage(`📞 Connecting you to our support line: ${this.botData.phone}`, 'bot');
      } else {
        // Fallback
        window.location.href = 'tel:+1-555-123-4567';
        this.addMessage('📞 Connecting you to our support line...', 'bot');
      }
    },
    
    getSessionId: function() {
      // Get or create a session ID for persistent conversations
      let sessionId = localStorage.getItem('npo_bots_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('npo_bots_session_id', sessionId);
      }
      return sessionId;
    },
    
    trackEvent: function(eventName, eventData = {}) {
      // Add common data
      const data = {
        ...eventData,
        botId: this.config.botId,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer
      };
      
      // Log to console in development
      if (this.config.debug) {
        console.log(`NPO Bots Event: ${eventName}`, data);
      }
      
      // Send to API
      if (this.config.apiUrl) {
        const trackingUrl = `${this.config.apiUrl}/track`;
        
        fetch(trackingUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event: eventName,
            data
          }),
          // Use keepalive to ensure the request is sent even if page is unloading
          keepalive: true
        }).catch(err => {
          if (this.config.debug) {
            console.error('NPO Bots tracking error:', err);
          }
        });
      }
      
      // Send to Google Analytics if available
      if (typeof window.gtag === 'function') {
        window.gtag('event', `npobots_${eventName}`, {
          botId: this.config.botId,
          ...eventData
        });
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NPOBots.init());
  } else {
    NPOBots.init();
  }

  // Make NPOBots globally available
  window.NPOBots = NPOBots;
})();