import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiMessageCircle, FiMail, FiPhone, FiTrendingUp, FiDownload } = FiIcons;

const AnalyticsDashboard = ({ chatbot }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState({
    totalInteractions: 0,
    chatMessages: 0,
    emailsSent: 0,
    phoneCalls: 0,
    volunteerSignups: 0,
    donations: 0,
    conversionRate: 0,
    popularTimes: [],
    topPages: [],
    recentActivity: []
  });

  // Load analytics data (in production, this would come from your backend)
  useEffect(() => {
    // For now, show empty state for production
    setAnalytics({
      totalInteractions: 0,
      chatMessages: 0,
      emailsSent: 0,
      phoneCalls: 0,
      volunteerSignups: 0,
      donations: 0,
      conversionRate: 0,
      popularTimes: [],
      topPages: [],
      recentActivity: []
    });
  }, [timeRange, chatbot.id]);

  const statCards = [
    {
      title: 'Total Interactions',
      value: analytics.totalInteractions,
      icon: FiUsers,
      color: 'blue'
    },
    {
      title: 'Chat Messages',
      value: analytics.chatMessages,
      icon: FiMessageCircle,
      color: 'green'
    },
    {
      title: 'Emails Sent',
      value: analytics.emailsSent,
      icon: FiMail,
      color: 'purple'
    },
    {
      title: 'Phone Calls',
      value: analytics.phoneCalls,
      icon: FiPhone,
      color: 'orange'
    },
    {
      title: 'Volunteer Signups',
      value: analytics.volunteerSignups,
      icon: FiUsers,
      color: 'emerald'
    },
    {
      title: 'Donations',
      value: analytics.donations,
      icon: FiTrendingUp,
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      emerald: 'bg-emerald-50 text-emerald-600',
      red: 'bg-red-50 text-red-600'
    };
    return colors[color] || colors.blue;
  };

  const exportData = () => {
    const data = {
      chatbot: chatbot.name,
      timeRange,
      analytics,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatbot.name}-analytics-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={exportData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiDownload} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                <SafeIcon icon={stat.icon} className="text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <SafeIcon icon={FiTrendingUp} className="text-6xl text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
        <p className="text-gray-600 mb-6">
          Once your chatbot starts receiving interactions, you'll see detailed analytics here including:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiUsers} className="text-blue-500" />
            <span className="text-sm text-gray-700">User engagement metrics</span>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiMessageCircle} className="text-green-500" />
            <span className="text-sm text-gray-700">Chat conversation data</span>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiMail} className="text-purple-500" />
            <span className="text-sm text-gray-700">Email interaction tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiTrendingUp} className="text-orange-500" />
            <span className="text-sm text-gray-700">Conversion rate analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;