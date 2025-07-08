(function() {
  'use strict';
  
  // NPO Bots Widget Script
  const NPOBots = {
    config: null,
    widget: null,
    isOpen: false,
    
    init: function() {
      this.config = window.NPOBotsConfig;
      if (!this.config || !this.config.botId) {
        console.error('NPO Bots: Missing configuration');
        return;
      }
      
      this.loadStyles();
      this.createWidget();
      this.bindEvents();
      this.fetchBotData();
    },
    
    loadStyles: function() {
      const styles = `
        .npo-bots-widget {
          position: fixed;
          z-index: 9999;
          font-family: ${this.config.theme.fontFamily};
          font-size: ${this.config.theme.fontSize};
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
          border-radius: ${this.config.theme.borderRadius};
          background: ${this.config.theme.primaryColor};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .npo-bots-toggle:hover {
          transform: scale(1.1);
        }
        
        .npo-bots-chat {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: ${this.config.theme.borderRadius};
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: none;
          flex-direction: column;
          overflow: hidden;
        }
        
        .npo-bots-chat.open {
          display: flex;
        }
        
        .npo-bots-header {
          background: ${this.config.theme.primaryColor};
          color: white;
          padding: 16px;
          font-weight: 600;
        }
        
        .npo-bots-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f9fafb;
        }
        
        .npo-bots-message {
          margin-bottom: 12px;
          padding: 8px 12px;
          border-radius: 8px;
          max-width: 80%;
        }
        
        .npo-bots-message.bot {
          background: #e5e7eb;
          color: #374151;
        }
        
        .npo-bots-message.user {
          background: ${this.config.theme.primaryColor};
          color: white;
          margin-left: auto;
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
        
        .npo-bots-input button {
          margin-left: 8px;
          padding: 8px 16px;
          background: ${this.config.theme.primaryColor};
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
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
        
        .npo-bots-donate {
          background: #ef4444;
          color: white;
        }
        
        .npo-bots-contact {
          background: #6366f1;
          color: white;
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
          </div>
          <div class="npo-bots-messages" id="npo-bots-messages"></div>
          <div class="npo-bots-input">
            <input type="text" id="npo-bots-input" placeholder="Type your message...">
            <button onclick="NPOBots.sendMessage()">Send</button>
          </div>
          <div class="npo-bots-actions" id="npo-bots-actions"></div>
        </div>
        <button class="npo-bots-toggle" onclick="NPOBots.toggle()">
          💬
        </button>
      `;
      
      document.body.appendChild(this.widget);
    },
    
    bindEvents: function() {
      const input = document.getElementById('npo-bots-input');
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    },
    
    fetchBotData: function() {
      // In a real implementation, this would fetch from your API
      // For now, we'll simulate with the config data
      setTimeout(() => {
        this.updateWidget({
          name: 'NPO Support Bot',
          welcomeMessage: 'Hello! How can we help you make a difference today?',
          volunteerEnabled: true,
          donationEnabled: true,
          donationAmounts: [25, 50, 100, 250],
          emailEnabled: true,
          phoneEnabled: true
        });
      }, 500);
    },
    
    updateWidget: function(botData) {
      document.getElementById('npo-bots-title').textContent = botData.name;
      this.addMessage(botData.welcomeMessage, 'bot');
      
      const actionsContainer = document.getElementById('npo-bots-actions');
      actionsContainer.innerHTML = '';
      
      if (botData.volunteerEnabled) {
        const volunteerBtn = document.createElement('button');
        volunteerBtn.className = 'npo-bots-action-btn npo-bots-volunteer';
        volunteerBtn.textContent = 'I Want to Volunteer';
        volunteerBtn.onclick = () => this.handleVolunteer();
        actionsContainer.appendChild(volunteerBtn);
      }
      
      if (botData.donationEnabled && botData.donationAmounts) {
        const donateContainer = document.createElement('div');
        donateContainer.innerHTML = '<div style="margin-bottom: 8px; font-weight: 500;">Quick Donation:</div>';
        
        const donateGrid = document.createElement('div');
        donateGrid.style.display = 'grid';
        donateGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        donateGrid.style.gap = '8px';
        
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
    },
    
    toggle: function() {
      const chat = document.getElementById('npo-bots-chat');
      this.isOpen = !this.isOpen;
      chat.classList.toggle('open', this.isOpen);
    },
    
    sendMessage: function() {
      const input = document.getElementById('npo-bots-input');
      const message = input.value.trim();
      if (!message) return;
      
      this.addMessage(message, 'user');
      input.value = '';
      
      // Simulate bot response
      setTimeout(() => {
        this.addMessage('Thanks for your message! Our team will get back to you soon.', 'bot');
      }, 1000);
    },
    
    addMessage: function(text, sender) {
      const messagesContainer = document.getElementById('npo-bots-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `npo-bots-message ${sender}`;
      messageDiv.textContent = text;
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    handleVolunteer: function() {
      this.addMessage('🙋‍♀️ Thank you for wanting to volunteer! Someone from our team will contact you soon about volunteer opportunities.', 'bot');
    },
    
    handleDonation: function(amount) {
      this.addMessage(`❤️ Thank you for your generous $${amount} donation! This will make a real difference in our mission.`, 'bot');
    },
    
    handleEmail: function() {
      this.addMessage('📧 Opening email client...', 'bot');
      window.location.href = 'mailto:support@npobot.org';
    },
    
    handlePhone: function() {
      this.addMessage('📞 Connecting you to our support line...', 'bot');
      window.location.href = 'tel:+1-555-123-4567';
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