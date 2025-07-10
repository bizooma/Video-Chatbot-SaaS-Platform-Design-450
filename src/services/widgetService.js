import supabase from '../lib/supabase';

/**
 * Generate the widget script URL based on environment
 * @param {string} environment - The environment (production, staging, development)
 * @returns {string} - The widget script URL
 */
export const getWidgetScriptUrl = (environment = 'production') => {
  const urls = {
    production: 'https://npobots.com/widget.js',
    staging: 'https://staging.npobots.com/widget.js',
    development: 'http://localhost:3000/widget.js'
  };
  
  return urls[environment] || urls.production;
};

/**
 * Generate the widget embed code for a chatbot
 * @param {string} botId - The ID of the chatbot
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - The generated widget code and configuration
 */
export const generateWidgetCode = async (botId, options = {}) => {
  try {
    // Get chatbot data to ensure it exists
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select('id, name, theme')
      .eq('id', botId)
      .single();
      
    if (error) {
      console.error('Error fetching chatbot for widget code:', error);
      
      // Fallback to localStorage for development
      const chatbots = JSON.parse(localStorage.getItem('videobot_chatbots') || '[]');
      const chatbotData = chatbots.find(bot => bot.id === botId);
      
      if (!chatbotData) {
        throw new Error('Chatbot not found');
      }
      
      // Use the chatbot data from localStorage
      const scriptUrl = options.scriptUrl || getWidgetScriptUrl(process.env.NODE_ENV);
      
      // Create configuration object
      const config = {
        botId: chatbotData.id,
        apiUrl: options.apiUrl || 'https://api.npobots.com',
        position: options.position || chatbotData.position || 'bottom-right',
        theme: {
          primaryColor: chatbotData.theme?.primaryColor || '#3b82f6',
          borderRadius: chatbotData.theme?.borderRadius || '12px',
          fontFamily: chatbotData.theme?.fontFamily || 'Inter, sans-serif',
          fontSize: chatbotData.theme?.fontSize || '14px'
        }
      };
      
      // Generate code based on type
      let code;
      
      switch (options.type) {
        case 'async':
          code = `<!-- NPO Bots Widget (Async) -->\n<script>\n  (function() {\n    window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};\n    var script = document.createElement('script');\n    script.src = '${scriptUrl}';\n    script.async = true;\n    document.head.appendChild(script);\n  })();\n</script>`;
          break;
          
        case 'custom':
          code = `<!-- NPO Bots Widget (Custom) -->\n<div id="npo-bots-widget" data-bot-id="${botId}"></div>\n<script>\n  window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};\n</script>\n<script src="${scriptUrl}" async></script>`;
          break;
          
        default:
          code = `<!-- NPO Bots Widget -->\n<script>\n  window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};\n</script>\n<script src="${scriptUrl}" async></script>`;
      }
      
      return {
        code,
        config,
        scriptUrl
      };
    }
    
    // Base URL for the widget script
    const scriptUrl = options.scriptUrl || getWidgetScriptUrl(process.env.NODE_ENV);
    
    // Create configuration object
    const config = {
      botId: chatbot.id,
      apiUrl: options.apiUrl || 'https://api.npobots.com',
      position: options.position || 'bottom-right',
      theme: {
        primaryColor: chatbot.theme?.primaryColor || '#3b82f6',
        borderRadius: chatbot.theme?.borderRadius || '12px',
        fontFamily: chatbot.theme?.fontFamily || 'Inter, sans-serif',
        fontSize: chatbot.theme?.fontSize || '14px'
      }
    };
    
    // Generate code based on type
    let code;
    
    switch (options.type) {
      case 'async':
        code = `<!-- NPO Bots Widget (Async) -->\n<script>\n  (function() {\n    window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};\n    var script = document.createElement('script');\n    script.src = '${scriptUrl}';\n    script.async = true;\n    document.head.appendChild(script);\n  })();\n</script>`;
        break;
        
      case 'custom':
        code = `<!-- NPO Bots Widget (Custom) -->\n<div id="npo-bots-widget" data-bot-id="${botId}"></div>\n<script>\n  window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};\n</script>\n<script src="${scriptUrl}" async></script>`;
        break;
        
      default:
        code = `<!-- NPO Bots Widget -->\n<script>\n  window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};\n</script>\n<script src="${scriptUrl}" async></script>`;
    }
    
    // Log widget generation
    try {
      await supabase
        .from('widget_generations')
        .insert([{
          bot_id: botId,
          code_type: options.type || 'standard',
          timestamp: new Date().toISOString()
        }]);
    } catch (logError) {
      console.warn('Failed to log widget generation:', logError);
    }
    
    return {
      code,
      config,
      scriptUrl
    };
  } catch (error) {
    console.error('Failed to generate widget code:', error);
    throw error;
  }
};

/**
 * Create a test page with the widget embedded
 * @param {string} botId - The ID of the chatbot
 * @returns {Promise<string>} - The HTML for the test page
 */
export const createWidgetTestPage = async (botId) => {
  try {
    const { code } = await generateWidgetCode(botId);
    
    // HTML template for test page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NPO Bots Widget Test</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #3b82f6;
    }
    .test-section {
      margin: 40px 0;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
    .button {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h1>NPO Bots Widget Test Page</h1>
  
  <div class="test-section">
    <h2>Welcome to your chatbot test page</h2>
    <p>This page allows you to test your NPO Bots chatbot in a real environment. Try interacting with the chatbot by clicking the chat icon in the bottom right corner.</p>
    <p>You can test all features including:</p>
    <ul>
      <li>Chat messaging</li>
      <li>Video playback</li>
      <li>Volunteer sign-up</li>
      <li>Donation buttons</li>
      <li>Email and phone contact</li>
    </ul>
  </div>
  
  <div class="test-section">
    <h2>Next Steps</h2>
    <p>Once you're happy with how your chatbot works, you can add it to your website by copying the widget code from your dashboard.</p>
    <a href="#" class="button" onclick="window.close(); return false;">Close Test Page</a>
  </div>
  
  ${code}
</body>
</html>`;
    
    return html;
  } catch (error) {
    console.error('Failed to create test page:', error);
    throw error;
  }
};