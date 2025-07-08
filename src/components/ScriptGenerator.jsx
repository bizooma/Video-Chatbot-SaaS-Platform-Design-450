import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCode, FiCopy, FiCheck, FiExternalLink, FiSettings } = FiIcons;

const ScriptGenerator = ({ chatbot }) => {
  const [copied, setCopied] = useState(false);
  const [scriptType, setScriptType] = useState('standard');

  const baseUrl = window.location.origin;
  const scriptUrl = `${baseUrl}/widget.js`;
  
  const generateScript = () => {
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
      return `<!-- NPO Bots Widget -->
<script>
  window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="${scriptUrl}" async></script>`;
    } else if (scriptType === 'async') {
      return `<!-- NPO Bots Widget (Async) -->
<script>
  (function() {
    window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};
    var script = document.createElement('script');
    script.src = '${scriptUrl}';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;
    } else {
      return `<!-- NPO Bots Widget (Custom) -->
<div id="npo-bots-widget" data-bot-id="${chatbot.id}"></div>
<script>
  window.NPOBotsConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="${scriptUrl}" async></script>`;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateScript());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const testScript = () => {
    window.open(`${baseUrl}/test/${chatbot.id}`, '_blank');
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={copied ? FiCheck : FiCopy} />
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            <code>{generateScript()}</code>
          </pre>
        </div>
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
          <p>• API Endpoint: <code className="bg-gray-200 px-2 py-1 rounded">{baseUrl}/api/chatbot/{chatbot.id}</code></p>
          <p>• Updates: Real-time (changes reflect immediately)</p>
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerator;