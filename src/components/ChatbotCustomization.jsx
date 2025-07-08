import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useChatbot } from '../contexts/ChatbotContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPalette, FiType, FiLayout, FiEye, FiSave } = FiIcons;

const ChatbotCustomization = ({ chatbot }) => {
  const { updateChatbot } = useChatbot();
  const [activeTab, setActiveTab] = useState('appearance');
  
  const [customization, setCustomization] = useState({
    theme: {
      primaryColor: chatbot.theme?.primaryColor || '#3b82f6',
      secondaryColor: chatbot.theme?.secondaryColor || '#f3f4f6',
      textColor: chatbot.theme?.textColor || '#1f2937',
      borderRadius: chatbot.theme?.borderRadius || '12px',
      fontFamily: chatbot.theme?.fontFamily || 'Inter, sans-serif',
      fontSize: chatbot.theme?.fontSize || '14px'
    },
    position: chatbot.position || 'bottom-right',
    size: chatbot.size || 'medium',
    animation: chatbot.animation || 'bounce',
    showBranding: chatbot.showBranding !== false,
    customCSS: chatbot.customCSS || ''
  });

  const handleSave = () => {
    updateChatbot(chatbot.id, {
      theme: customization.theme,
      position: customization.position,
      size: customization.size,
      animation: customization.animation,
      showBranding: customization.showBranding,
      customCSS: customization.customCSS
    });
  };

  const presetColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: FiPalette },
    { id: 'layout', label: 'Layout', icon: FiLayout },
    { id: 'typography', label: 'Typography', icon: FiType },
    { id: 'advanced', label: 'Advanced', icon: FiEye }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chatbot Customization</h2>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiSave} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <SafeIcon icon={tab.icon} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Primary Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={customization.theme.primaryColor}
                  onChange={(e) => setCustomization(prev => ({
                    ...prev,
                    theme: { ...prev.theme, primaryColor: e.target.value }
                  }))}
                  className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <div className="flex space-x-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomization(prev => ({
                        ...prev,
                        theme: { ...prev.theme, primaryColor: color }
                      }))}
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Border Radius
              </label>
              <select
                value={customization.theme.borderRadius}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  theme: { ...prev.theme, borderRadius: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="4px">Small (4px)</option>
                <option value="8px">Medium (8px)</option>
                <option value="12px">Large (12px)</option>
                <option value="16px">Extra Large (16px)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Animation Style
              </label>
              <select
                value={customization.animation}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  animation: e.target.value
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bounce">Bounce</option>
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Position
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'bottom-right', label: 'Bottom Right' },
                  { value: 'bottom-left', label: 'Bottom Left' },
                  { value: 'top-right', label: 'Top Right' },
                  { value: 'top-left', label: 'Top Left' }
                ].map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => setCustomization(prev => ({
                      ...prev,
                      position: pos.value
                    }))}
                    className={`p-4 border rounded-lg transition-colors ${
                      customization.position === pos.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Size
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setCustomization(prev => ({
                      ...prev,
                      size: size.value
                    }))}
                    className={`px-6 py-3 border rounded-lg transition-colors ${
                      customization.size === size.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Font Family
              </label>
              <select
                value={customization.theme.fontFamily}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  theme: { ...prev.theme, fontFamily: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Open Sans, sans-serif">Open Sans</option>
                <option value="Lato, sans-serif">Lato</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Font Size
              </label>
              <select
                value={customization.theme.fontSize}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  theme: { ...prev.theme, fontSize: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="12px">Small (12px)</option>
                <option value="14px">Medium (14px)</option>
                <option value="16px">Large (16px)</option>
                <option value="18px">Extra Large (18px)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Text Color
              </label>
              <input
                type="color"
                value={customization.theme.textColor}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  theme: { ...prev.theme, textColor: e.target.value }
                }))}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Show NPO Bots Branding</h4>
                <p className="text-sm text-gray-600">Display "Powered by NPO Bots" in the widget</p>
              </div>
              <button
                onClick={() => setCustomization(prev => ({
                  ...prev,
                  showBranding: !prev.showBranding
                }))}
                className="flex items-center"
              >
                <SafeIcon 
                  icon={customization.showBranding ? FiIcons.FiToggleRight : FiIcons.FiToggleLeft} 
                  className={`text-3xl ${customization.showBranding ? 'text-blue-600' : 'text-gray-400'}`} 
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Custom CSS
              </label>
              <textarea
                value={customization.customCSS}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  customCSS: e.target.value
                }))}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="/* Add your custom CSS here */
.npo-bots-widget {
  /* Custom styles */
}"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Live Preview */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Live Preview</h3>
        <div className="flex justify-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
            style={{ 
              backgroundColor: customization.theme.primaryColor,
              borderRadius: customization.theme.borderRadius,
              fontFamily: customization.theme.fontFamily,
              fontSize: customization.theme.fontSize
            }}
          >
            Chat
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotCustomization;