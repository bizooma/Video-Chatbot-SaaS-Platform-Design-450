import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useChatbot } from '../contexts/ChatbotContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMessageCircle, FiMail, FiPhone, FiSave, FiToggleLeft, FiToggleRight, FiUsers, FiHeart, FiDollarSign, FiLink } = FiIcons;

const ChatbotSettings = ({ chatbot }) => {
  const [settings, setSettings] = useState({
    name: chatbot.name,
    welcomeMessage: chatbot.welcomeMessage,
    email: chatbot.email,
    phone: chatbot.phone,
    chatEnabled: chatbot.chatEnabled,
    emailEnabled: chatbot.emailEnabled,
    phoneEnabled: chatbot.phoneEnabled,
    volunteerEnabled: chatbot.volunteerEnabled || false,
    volunteerUrl: chatbot.volunteerUrl || '',
    donationEnabled: chatbot.donationEnabled || false,
    donationUrl: chatbot.donationUrl || '',
    donationAmounts: chatbot.donationAmounts || [25, 50, 100, 250]
  });

  const { updateChatbot } = useChatbot();

  const handleSave = () => {
    updateChatbot(chatbot.id, settings);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateDonationAmount = (index, value) => {
    const newAmounts = [...settings.donationAmounts];
    newAmounts[index] = parseInt(value) || 0;
    setSettings(prev => ({ ...prev, donationAmounts: newAmounts }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chatbot Settings</h2>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiSave} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chatbot Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter chatbot name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welcome Message
              </label>
              <input
                type="text"
                value={settings.welcomeMessage}
                onChange={(e) => setSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter welcome message"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="support@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Phone
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Nonprofit Features */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nonprofit Features</h3>
          
          {/* Volunteer Settings */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiUsers} className="text-green-600 text-xl" />
                <div>
                  <h4 className="font-medium text-gray-900">Volunteer Button</h4>
                  <p className="text-sm text-gray-600">Enable "I Want to Volunteer" button</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('volunteerEnabled')}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.volunteerEnabled ? FiToggleRight : FiToggleLeft}
                  className={`text-3xl ${settings.volunteerEnabled ? 'text-green-600' : 'text-gray-400'}`}
                />
              </button>
            </div>

            {settings.volunteerEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volunteer Form URL (optional)
                </label>
                <input
                  type="url"
                  value={settings.volunteerUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, volunteerUrl: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-volunteer-form.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If provided, clicking the volunteer button will open this URL. Otherwise, it will send a message.
                </p>
              </div>
            )}
          </div>

          {/* Donation Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiHeart} className="text-red-600 text-xl" />
                <div>
                  <h4 className="font-medium text-gray-900">Donation Buttons</h4>
                  <p className="text-sm text-gray-600">Enable quick donation buttons</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('donationEnabled')}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.donationEnabled ? FiToggleRight : FiToggleLeft}
                  className={`text-3xl ${settings.donationEnabled ? 'text-red-600' : 'text-gray-400'}`}
                />
              </button>
            </div>

            {settings.donationEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Page URL (optional)
                  </label>
                  <input
                    type="url"
                    value={settings.donationUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, donationUrl: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://your-donation-page.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If provided, donation buttons will link to this page with amount parameters.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Amounts ($)
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {settings.donationAmounts.map((amount, index) => (
                      <div key={index} className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </div>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => updateDonationAmount(index, e.target.value)}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="25"
                          min="1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Toggles */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Features</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMessageCircle} className="text-blue-600 text-xl" />
                <div>
                  <h4 className="font-medium text-gray-900">Live Chat</h4>
                  <p className="text-sm text-gray-600">Enable real-time chat support</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('chatEnabled')}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.chatEnabled ? FiToggleRight : FiToggleLeft}
                  className={`text-3xl ${settings.chatEnabled ? 'text-blue-600' : 'text-gray-400'}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMail} className="text-green-600 text-xl" />
                <div>
                  <h4 className="font-medium text-gray-900">Email Support</h4>
                  <p className="text-sm text-gray-600">Allow visitors to send emails</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('emailEnabled')}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.emailEnabled ? FiToggleRight : FiToggleLeft}
                  className={`text-3xl ${settings.emailEnabled ? 'text-green-600' : 'text-gray-400'}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiPhone} className="text-purple-600 text-xl" />
                <div>
                  <h4 className="font-medium text-gray-900">Phone Support</h4>
                  <p className="text-sm text-gray-600">Enable phone call button</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('phoneEnabled')}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.phoneEnabled ? FiToggleRight : FiToggleLeft}
                  className={`text-3xl ${settings.phoneEnabled ? 'text-purple-600' : 'text-gray-400'}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSettings;