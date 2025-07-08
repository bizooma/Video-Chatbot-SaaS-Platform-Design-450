import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiMessageCircle, FiMail, FiPhone, FiTrendingUp, FiCalendar, FiDownload } = FiIcons;

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

  // Simulate analytics data
  useEffect(() => {
    const simulateAnalytics = () => {
      const baseData = {
        totalInteractions: Math.floor(Math.random() * 1000) + 500,
        chatMessages: Math.floor(Math.random() * 300) + 150,
        emailsSent: Math.floor(Math.random() * 100) + 50,
        phoneCalls: Math.floor(Math.random() * 50) + 25,
        volunteerSignups: Math.floor(Math.random() * 20) + 10,
        donations: Math.floor(Math.random() * 15) + 5,
        conversionRate: (Math.random() * 10 + 5).toFixed(1),
        popularTimes: [
          { hour: '9 AM', interactions: 45 },
          { hour: '12 PM', interactions: 78 },
          { hour: '3 PM', interactions: 92 },
          { hour: '6 PM', interactions: 67 },
          { hour: '9 PM', interactions: 34 }
        ],
        topPages: [
          { page: '/donate', interactions: 156 },
          { page: '/volunteer', interactions: 134 },
          { page: '/about', interactions: 89 },
          { page: '/contact', interactions: 67 }
        ],
        recentActivity: [
          { type: 'volunteer', message: 'New volunteer signup from Sarah M.', time: '2 minutes ago' },
          { type: 'donation', message: '$50 donation received', time: '15 minutes ago' },
          { type: 'email', message: 'Support email sent to john@example.com', time: '1 hour ago' },
          { type: 'chat', message: 'Chat conversation completed', time: '2 hours ago' }
        ]
      };
      setAnalytics(baseData);
    };

    simulateAnalytics();
  }, [timeRange, chatbot.id]);

  const statCards = [
    {
      title: 'Total Interactions',
      value: analytics.totalInteractions,
      icon: FiUsers,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Chat Messages',
      value: analytics.chatMessages,
      icon: FiMessageCircle,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Emails Sent',
      value: analytics.emailsSent,
      icon: FiMail,
      color: 'purple',
      change: '+15%'
    },
    {
      title: 'Phone Calls',
      value: analytics.phoneCalls,
      icon: FiPhone,
      color: 'orange',
      change: '+5%'
    },
    {
      title: 'Volunteer Signups',
      value: analytics.volunteerSignups,
      icon: FiUsers,
      color: 'emerald',
      change: '+23%'
    },
    {
      title: 'Donations',
      value: analytics.donations,
      icon: FiTrendingUp,
      color: 'red',
      change: '+18%'
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
                <p className="text-sm text-green-600 mt-1">{stat.change} vs last period</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                <SafeIcon icon={stat.icon} className="text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Times */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Times</h3>
          <div className="space-y-3">
            {analytics.popularTimes.map((time, index) => (
              <div key={time.hour} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{time.hour}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(time.interactions / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{time.interactions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analytics.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{page.page}</span>
                <span className="text-sm font-medium text-gray-900">{page.interactions}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-4">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'volunteer' ? 'bg-green-100 text-green-600' :
                  activity.type === 'donation' ? 'bg-red-100 text-red-600' :
                  activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <SafeIcon icon={
                    activity.type === 'volunteer' ? FiUsers :
                    activity.type === 'donation' ? FiTrendingUp :
                    activity.type === 'email' ? FiMail :
                    FiMessageCircle
                  } className="text-sm" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;