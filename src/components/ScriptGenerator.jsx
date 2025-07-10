import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { generateWidgetCode, createWidgetTestPage } from '../api/widgetApi';

const { FiCode, FiCopy, FiCheck, FiExternalLink, FiSettings } = FiIcons;

const ScriptGenerator = ({ chatbot }) => {
  const [copied, setCopied] = useState(false);
  const [scriptType, setScriptType] = useState('standard');
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate script when component mounts or when chatbot or script type changes
  useEffect(() => {
    const generateScript = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await generateWidgetCode(chatbot.id, { 
          type: scriptType,
          // Use appropriate domain based on environment
          scriptUrl: window.location.hostname === 'localhost' 
            ? `${window.location.origin}/widget.js`
            : `https://${window.location.hostname}/widget.js`
        });
        
        setScript(result.code);
      } catch (err) {
        console.error('Failed to generate widget code:', err);
        setError('Failed to generate embed code. Please try again.');
        
        // Fallback to client-side generation
        const baseUrl = window.location.origin;
        const scriptUrl = `${baseUrl}/widget.js`;

        const config = {
          botId: chatbot.id,
          apiUrl: `${baseUrl}/api/chatbot/${chatbot.id}`,
          position: 'bottom-right',
          theme: {
            primaryColor: chatbot.theme?.primaryColor || '#3b82f6',
            borderRadius: chatbot.theme?.borderRadius || '12px',
            fontFamily: chatbot.theme?.fontFamily || 'Inter, sans-serif'
          }
        };

        if (scriptType === 'standard') {
          setScript(`<!-- NPO Bots Widget -->
<script>
  window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="${scriptUrl}" async></script>`);
        } else if (scriptType === 'async') {
          setScript(`<!-- NPO Bots Widget (Async) -->
<script>
  (function() {
    window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};
    var script = document.createElement('script');
    script.src = '${scriptUrl}';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`);
        } else {
          setScript(`<!-- NPO Bots Widget (Custom) -->
<div id="npo-bots-widget" data-bot-id="${chatbot.id}"></div>
<script>
  window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="${scriptUrl}" async></script>`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    generateScript();
  }, [chatbot.id, scriptType, chatbot.theme]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const testScript = async () => {
    try {
      // Create a test page with the widget
      const html = await createWidgetTestPage(chatbot.id);
      
      // Open in a new window
      const testWindow = window.open('', '_blank');
      testWindow.document.write(html);
      testWindow.document.close();
    } catch (err) {
      console.error('Failed to create test page:', err);
      
      // Fallback - open a simpler test page
      const testUrl = `${window.location.origin}/test/${chatbot.id}`;
      window.open(testUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Integration Script</h2>
        <button
          onClick={testScript}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiExternalLink} />
          <span>Test Live</span>
        </button>
      </div>

      {/* Script Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Script Type
        </label>
        <div className="flex space-x-4">
          {[
            { value: 'standard', label: 'Standard' },
            { value: 'async', label: 'Async Load' },
            { value: 'custom', label: 'Custom Container' }
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => setScriptType(type.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                scriptType === type.value
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Script Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            HTML Script Code
          </label>
          <button
            onClick={copyToClipboard}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <SafeIcon icon={copied ? FiCheck : FiCopy} />
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        <div className="relative">
          {isLoading ? (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Generating code...</span>
            </div>
          ) : (
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              <code>{script}</code>
            </pre>
          )}
        </div>
        {error && (
          <div className="mt-2 text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Installation Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Installation Instructions</h3>
        <ol className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start space-x-2">
            <span className="font-semibold">1.</span>
            <span>Copy the script code above</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold">2.</span>
            <span>Paste it before the closing &lt;/body&gt; tag on your website</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold">3.</span>
            <span>The chatbot will automatically appear and update when you make changes</span>
          </li>
        </ol>
      </div>

      {/* Advanced Configuration */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Advanced Configuration</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Bot ID: <code className="bg-gray-200 px-2 py-1 rounded">{chatbot.id}</code></p>
          <p>• API Endpoint: <code className="bg-gray-200 px-2 py-1 rounded">https://api.npobots.com/chatbot/{chatbot.id}</code></p>
          <p>• Updates: Real-time (changes reflect immediately)</p>
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerator;