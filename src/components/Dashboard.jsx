import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChatbot } from '../contexts/ChatbotContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ChatbotSettings from './ChatbotSettings';
import ChatbotCustomization from './ChatbotCustomization';
import VideoUpload from './VideoUpload';
import EnhancedChatbotTraining from './EnhancedChatbotTraining';
import ScriptGenerator from './ScriptGenerator';
import AnalyticsDashboard from './AnalyticsDashboard';
import VolunteerManagement from './VolunteerManagement';
import AccountManagement from './AccountManagement';
import { getVolunteers } from '../services/volunteerService';
// Import analytics
import { trackPageView, trackChatbotCreated } from '../utils/analytics';

const {
  FiPlus,
  FiTrash2,
  FiSettings,
  FiEdit3,
  FiVideo,
  FiFileText,
  FiCode,
  FiPieChart,
  FiUsers,
  FiUser,
  FiLock
} = FiIcons;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { chatbots, selectedChatbot, setSelectedChatbot, createChatbot, deleteChatbot } = useChatbot();
  const [activeTab, setActiveTab] = useState('settings');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [isLoadingVolunteers, setIsLoadingVolunteers] = useState(false);
  const navigate = useNavigate();

  // Track dashboard page view
  useEffect(() => {
    if (user) {
      trackPageView('/dashboard', 'Dashboard');
    }
  }, [user]);

  // Load volunteers for selected chatbot
  useEffect(() => {
    const loadVolunteers = async () => {
      if (selectedChatbot) {
        setIsLoadingVolunteers(true);
        try {
          const data = await getVolunteers(selectedChatbot.id);
          setVolunteers(data);
        } catch (error) {
          console.error('Failed to load volunteers:', error);
        } finally {
          setIsLoadingVolunteers(false);
        }
      }
    };
    
    loadVolunteers();
  }, [selectedChatbot]);

  // Handle chatbot creation
  const handleCreateBot = () => {
    const newBot = createChatbot({
      name: `Chatbot ${chatbots.length + 1}`,
      welcomeMessage: 'Hello! How can I help you today?',
      email: user?.email || 'support@example.com',
      phone: '+1 (555) 123-4567'
    });
    setSelectedChatbot(newBot);
    
    // Track chatbot creation
    trackChatbotCreated('basic');
  };

  // Handle chatbot deletion
  const handleDeleteBot = () => {
    if (selectedChatbot) {
      deleteChatbot(selectedChatbot.id);
      setShowConfirmDelete(false);
    }
  };

  // Handle volunteer data refresh
  const handleRefreshVolunteers = async () => {
    if (selectedChatbot) {
      setIsLoadingVolunteers(true);
      try {
        const data = await getVolunteers(selectedChatbot.id);
        setVolunteers(data);
      } catch (error) {
        console.error('Failed to refresh volunteers:', error);
      } finally {
        setIsLoadingVolunteers(false);
      }
    }
  };

  // Dashboard tabs
  const tabs = [
    { id: 'settings', label: 'Settings', icon: FiSettings },
    { id: 'appearance', label: 'Appearance', icon: FiEdit3 },
    { id: 'video', label: 'Video', icon: FiVideo },
    { id: 'training', label: 'AI Training', icon: FiFileText, premium: true },
    { id: 'script', label: 'Integration', icon: FiCode },
    { id: 'analytics', label: 'Analytics', icon: FiPieChart, premium: true },
    { id: 'volunteers', label: 'Volunteers', icon: FiUsers },
    { id: 'account', label: 'Account', icon: FiUser }
  ];

  // Redirect to login if no user
  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752002958443-npobots-logo.png" 
                alt="NPO Bots Logo" 
                className="h-10 w-auto" 
              />
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div>
              <span className="mr-4 text-sm text-gray-600">
                {user.email} - <span className="capitalize">{user.plan || 'free'} Plan</span>
              </span>
              <button 
                onClick={logout}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Chatbot Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Chatbots</h2>
              
              {/* Chatbot List */}
              <div className="space-y-3 mb-4">
                {chatbots.length === 0 ? (
                  <p className="text-gray-500 text-sm">No chatbots yet. Create your first one!</p>
                ) : (
                  chatbots.map((bot) => (
                    <button
                      key={bot.id}
                      onClick={() => setSelectedChatbot(bot)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                        selectedChatbot?.id === bot.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${bot.isAiTrained ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="font-medium truncate">{bot.name}</span>
                      </div>
                      {selectedChatbot?.id === bot.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowConfirmDelete(true);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete chatbot"
                        >
                          <SafeIcon icon={FiTrash2} className="text-sm" />
                        </button>
                      )}
                    </button>
                  ))
                )}
              </div>
              
              {/* Create New Chatbot Button */}
              <button
                onClick={handleCreateBot}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiPlus} />
                <span>Create New Chatbot</span>
              </button>
            </div>
            
            {/* Navigation */}
            {selectedChatbot && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Navigation</h2>
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const isPremiumLocked = tab.premium && user.plan === 'free';
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        disabled={isPremiumLocked}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-800'
                            : isPremiumLocked
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={tab.icon} />
                          <span className="font-medium">{tab.label}</span>
                        </div>
                        {isPremiumLocked && (
                          <SafeIcon icon={FiLock} className="text-gray-400 text-sm" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}
            
            {/* Plan Info */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-lg font-bold mb-2">
                {user.plan === 'free' ? 'Free Plan' : 'Pro Plan'}
              </h2>
              <p className="text-blue-100 mb-4">
                {user.plan === 'free' 
                  ? 'Upgrade to access AI Training and Analytics' 
                  : 'You have access to all premium features'}
              </p>
              {user.plan === 'free' && (
                <button
                  onClick={() => window.location.hash = '#pricing'}
                  className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Upgrade Now
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedChatbot ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SafeIcon icon={FiPlus} className="text-blue-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Create Your First Chatbot
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start by creating a chatbot for your organization. You'll be able to customize it, add videos, and train it with your content.
                </p>
                <button
                  onClick={handleCreateBot}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Chatbot
                </button>
              </div>
            ) : (
              <>
                {activeTab === 'settings' && (
                  <ChatbotSettings chatbot={selectedChatbot} />
                )}
                {activeTab === 'appearance' && (
                  <ChatbotCustomization chatbot={selectedChatbot} />
                )}
                {activeTab === 'video' && (
                  <VideoUpload chatbot={selectedChatbot} />
                )}
                {activeTab === 'training' && (
                  <EnhancedChatbotTraining chatbot={selectedChatbot} />
                )}
                {activeTab === 'script' && (
                  <ScriptGenerator chatbot={selectedChatbot} />
                )}
                {activeTab === 'analytics' && (
                  <AnalyticsDashboard chatbot={selectedChatbot} />
                )}
                {activeTab === 'volunteers' && (
                  <VolunteerManagement 
                    volunteers={volunteers} 
                    isLoading={isLoadingVolunteers} 
                    onRefresh={handleRefreshVolunteers} 
                  />
                )}
                {activeTab === 'account' && (
                  <AccountManagement />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Chatbot?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedChatbot.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteBot}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;