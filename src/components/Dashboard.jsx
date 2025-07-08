import React,{useState} from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {useChatbot} from '../contexts/ChatbotContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import VideoUpload from './VideoUpload';
import ChatbotSettings from './ChatbotSettings';
import ChatbotCustomization from './ChatbotCustomization';
import ScriptGenerator from './ScriptGenerator';
import AnalyticsDashboard from './AnalyticsDashboard';
import ChatbotPreview from './ChatbotPreview';
import AccountManagement from './AccountManagement';

const {FiUser,FiSettings,FiVideo,FiMessageCircle,FiCode,FiBarChart3,FiEye,FiLogOut,FiPlus,FiPalette}=FiIcons;

const Dashboard=()=> {
  const [activeTab,setActiveTab]=useState('overview');
  const {user,logout}=useAuth();
  const {chatbots,selectedChatbot,setSelectedChatbot,createChatbot}=useChatbot();
  const navigate=useNavigate();

  const handleLogout=()=> {
    logout();
    navigate('/');
  };

  const handleCreateBot=()=> {
    const newBot=createChatbot({
      name: `Chatbot ${chatbots.length + 1}`,
      welcomeMessage: 'Hello! How can I help you today?',
      email: user?.email || 'support@example.com',
      phone: '+1 (555) 123-4567'
    });
    setSelectedChatbot(newBot);
  };

  const tabs=[
    {id: 'overview',label: 'Overview',icon: FiSettings},
    {id: 'video',label: 'Video Upload',icon: FiVideo},
    {id: 'settings',label: 'Bot Settings',icon: FiMessageCircle},
    {id: 'customization',label: 'Customization',icon: FiPalette},
    {id: 'script',label: 'Integration',icon: FiCode},
    {id: 'analytics',label: 'Analytics',icon: FiBarChart3},
    {id: 'preview',label: 'Preview',icon: FiEye},
    {id: 'account',label: 'Account',icon: FiUser}
  ];

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752002958443-npobots-logo.png" 
                alt="NPO Bots Logo" 
                className="h-14 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NPO Bots Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back,{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="text-gray-500" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <SafeIcon icon={FiLogOut} className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Your Chatbots</h3>
                <button
                  onClick={handleCreateBot}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="text-sm" />
                </button>
              </div>

              <div className="space-y-2">
                {chatbots.length===0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <SafeIcon icon={FiMessageCircle} className="text-4xl mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No chatbots yet</p>
                    <p className="text-xs">Click + to create your first one</p>
                  </div>
                ) : (
                  chatbots.map((bot)=> (
                    <button
                      key={bot.id}
                      onClick={()=> setSelectedChatbot(bot)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedChatbot?.id===bot.id 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{bot.name}</div>
                      <div className="text-sm text-gray-500">
                        {bot.video ? 'Video configured' : 'No video'}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        ID: {bot.id}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <nav className="space-y-2">
                {tabs.map((tab)=> (
                  <button
                    key={tab.id}
                    onClick={()=> setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab===tab.id 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="text-lg" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{opacity: 0,y: 20}}
              animate={{opacity: 1,y: 0}}
              transition={{duration: 0.3}}
            >
              {activeTab==='overview' && (
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 font-medium">Active Chatbots</p>
                          <p className="text-3xl font-bold text-blue-900">{chatbots.length}</p>
                        </div>
                        <SafeIcon icon={FiMessageCircle} className="text-blue-500 text-2xl" />
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 font-medium">Videos Uploaded</p>
                          <p className="text-3xl font-bold text-green-900">
                            {chatbots.filter(bot=> bot.video).length}
                          </p>
                        </div>
                        <SafeIcon icon={FiVideo} className="text-green-500 text-2xl" />
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 font-medium">Plan</p>
                          <p className="text-3xl font-bold text-purple-900 capitalize">{user.plan}</p>
                        </div>
                        <SafeIcon icon={FiUser} className="text-purple-500 text-2xl" />
                      </div>
                    </div>
                  </div>

                  {chatbots.length===0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <SafeIcon icon={FiMessageCircle} className="text-6xl text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your First Chatbot</h3>
                      <p className="text-gray-600 mb-6">Get started by creating a new chatbot to engage with your supporters</p>
                      <button
                        onClick={handleCreateBot}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <SafeIcon icon={FiPlus} />
                        <span>Create Chatbot</span>
                      </button>
                    </div>
                  ) : selectedChatbot && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Selected Bot: {selectedChatbot.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiVideo} className="text-gray-500" />
                          <span className="text-gray-700">
                            Video: {selectedChatbot.video ? 'Configured' : 'Not configured'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiCode} className="text-gray-500" />
                          <span className="text-gray-700">
                            Script: Ready for integration
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiPalette} className="text-gray-500" />
                          <span className="text-gray-700">
                            Theme: {selectedChatbot.theme?.primaryColor || 'Default'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiSettings} className="text-gray-500" />
                          <span className="text-gray-700">
                            Position: {selectedChatbot.position || 'bottom-right'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab==='video' && selectedChatbot && (
                <VideoUpload chatbot={selectedChatbot} />
              )}

              {activeTab==='settings' && selectedChatbot && (
                <ChatbotSettings chatbot={selectedChatbot} />
              )}

              {activeTab==='customization' && selectedChatbot && (
                <ChatbotCustomization chatbot={selectedChatbot} />
              )}

              {activeTab==='script' && selectedChatbot && (
                <ScriptGenerator chatbot={selectedChatbot} />
              )}

              {activeTab==='analytics' && selectedChatbot && (
                <AnalyticsDashboard chatbot={selectedChatbot} />
              )}

              {activeTab==='preview' && selectedChatbot && (
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Chatbot Preview</h2>
                  <div className="text-center mb-6">
                    <p className="text-gray-600">
                      This is how your chatbot will appear on your website
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <ChatbotPreview chatbot={selectedChatbot} />
                  </div>
                </div>
              )}

              {activeTab==='account' && (
                <AccountManagement />
              )}

              {/* Show message when no chatbot is selected */}
              {!selectedChatbot && activeTab !=='overview' && activeTab !=='account' && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <SafeIcon icon={FiMessageCircle} className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Chatbot Selected</h3>
                  <p className="text-gray-600 mb-6">Please select a chatbot from the sidebar or create a new one</p>
                  <button
                    onClick={handleCreateBot}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <SafeIcon icon={FiPlus} />
                    <span>Create Chatbot</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;