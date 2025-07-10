import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getChatbotData } from '../api/chatbotApi';

const WidgetTestPage = () => {
  const { botId } = useParams();
  const [chatbot, setChatbot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChatbot = async () => {
      try {
        const data = await getChatbotData(botId);
        setChatbot(data);
        
        // Configure the widget
        window.NPOBotsConfig = {
          botId: data.id,
          apiUrl: `${window.location.origin}/api`,
          position: data.position || 'bottom-right',
          theme: {
            primaryColor: data.theme?.primaryColor || '#3b82f6',
            borderRadius: data.theme?.borderRadius || '12px',
            fontFamily: data.theme?.fontFamily || 'Inter, sans-serif',
            fontSize: data.theme?.fontSize || '14px'
          }
        };
        
        // Load the widget script
        const script = document.createElement('script');
        script.src = '/widget.js';
        script.async = true;
        document.body.appendChild(script);
        
      } catch (err) {
        console.error('Failed to load chatbot:', err);
        setError('Failed to load chatbot. Please check if the ID is correct.');
      } finally {
        setLoading(false);
      }
    };
    
    loadChatbot();
  }, [botId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <button 
          onClick={() => window.history.back()} 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Widget Test Page</h1>
        <p className="text-gray-600">Testing chatbot: {chatbot?.name}</p>
      </header>
      
      <main>
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-3">How to use this test page</h2>
          <p className="mb-4">
            This page allows you to test your chatbot in a real environment. Try interacting 
            with it by clicking the chat icon in the bottom corner.
          </p>
          <p>You can test all features including:</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Chat messaging</li>
            <li>Video playback</li>
            <li>Volunteer sign-up</li>
            <li>Donation buttons</li>
            <li>Email and phone contact</li>
          </ul>
          <p className="text-sm text-gray-500">
            Note: Any interactions on this page will be recorded in your analytics dashboard.
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">Next Steps</h2>
          <p className="mb-4">
            Once you're happy with how your chatbot works, you can add it to your website by 
            copying the widget code from your dashboard.
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={() => window.history.back()} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg"
            >
              Reset Test
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WidgetTestPage;