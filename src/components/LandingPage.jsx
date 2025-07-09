import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import DemoChatbot from './DemoChatbot';
import PricingSection from './PricingSection';
import VeteranOwnedSection from './VeteranOwnedSection';
import FAQSection from './FAQSection';
import ContactSection from './ContactSection';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState('');
  const [isSubmittingForgotPassword, setIsSubmittingForgotPassword] = useState(false);

  const { login, signup, authError, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, {
          name: formData.name,
          company: formData.company
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmittingForgotPassword(true);
    setForgotPasswordStatus('');

    try {
      await resetPassword(forgotPasswordEmail);
      setForgotPasswordStatus('success');
    } catch (error) {
      setForgotPasswordStatus('error');
      console.error('Password reset failed:', error);
    } finally {
      setIsSubmittingForgotPassword(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', company: '' });
    setShowPassword(false);
  };

  const resetForgotPasswordForm = () => {
    setForgotPasswordEmail('');
    setForgotPasswordStatus('');
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    resetForm();
  };

  const openForgotPasswordModal = () => {
    setIsAuthModalOpen(false);
    setIsForgotPasswordModalOpen(true);
    resetForgotPasswordForm();
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
    setIsAuthModalOpen(true);
    resetForgotPasswordForm();
  };

  const handleWatchDemo = () => {
    window.open('https://www.youtube.com/watch?v=g1wVgV58JbE', '_blank');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const features = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1370/1370907.png",
      title: 'Chat Window',
      description: 'Chat with an AI agent for 24/7 support, answering common questions and guiding visitors through your mission.'
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1179/1179069.png",
      title: 'Intro Video',
      description: 'Greet visitors with a compelling video that shares your mission and creates emotional connection.'
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/159/159832.png",
      title: 'Click-to-Call',
      description: 'One tap and supporters are connected with your team for immediate personal engagement.'
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
      title: 'Email Button',
      description: 'Collect questions, stories, or support requests with ease through integrated contact forms.'
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
      title: 'Volunteer Sign-Up',
      description: 'Gather volunteer information with built-in forms that connect directly to your team.'
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
      title: 'Donation Buttons',
      description: 'Accept contributions in preset amounts or custom values with secure payment integration.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752002958443-npobots-logo.png"
                alt="NPO Bots Logo"
                className="h-16 w-auto"
              />
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon 
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png" 
                  alt="Login"
                  className="w-4 h-4"
                />
                <span>Log In</span>
              </motion.button>
              <motion.button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          >
            <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800"></div>
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Empower Your Mission with a{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Smart Nonprofit Chatbot
              </span>
            </motion.h1>
            <motion.p
              className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Turn website visitors into volunteers, donors, and advocates—24/7
            </motion.p>
            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Get Started</span>
                <SafeIcon 
                  src="https://cdn-icons-png.flaticon.com/512/271/271228.png" 
                  alt="Arrow Right"
                  className="w-5 h-5"
                />
              </button>
              <button
                onClick={handleWatchDemo}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <SafeIcon 
                  src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" 
                  alt="YouTube"
                  className="w-5 h-5"
                />
                <span>Watch Demo</span>
              </button>
            </motion.div>
            <motion.div
              className="mt-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/1370/1370907.png" 
                alt="Chat"
                className="w-4 h-4"
              />
              <span>Try our interactive demo chatbot in the bottom right corner!</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What is NPOBots?
            </h2>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              AI Chatbots Built for Nonprofits. No Coding Required.
            </h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              NPOBots is a simple, powerful SaaS platform that lets your nonprofit launch a fully functional chatbot in minutes. Designed specifically for the nonprofit world, our chatbots come pre-loaded with everything you need to connect with supporters, increase donations, and grow your impact.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 hover:border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Added above pricing */}
      <FAQSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Veteran-Owned Section - NEW */}
      <VeteranOwnedSection />

      {/* Contact Section - Added below pricing */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025{' '}
              <a
                href="https://bizooma.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Bizooma, LLC
              </a>
              . | NPO Bots, All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {authMode === 'login' ? 'Welcome Back' : 'Get Started with NPO Bots'}
              </h3>
              <p className="text-gray-600">
                {authMode === 'login' ? 'Sign in to your account' : 'Create your account to start building chatbots'}
              </p>
            </div>

            {authError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <SafeIcon 
                  src="https://cdn-icons-png.flaticon.com/512/564/564619.png" 
                  alt="Error"
                  className="w-5 h-5"
                />
                <span className="text-red-800">{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <SafeIcon 
                        src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png" 
                        alt="User"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your organization name"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <SafeIcon 
                    src="https://cdn-icons-png.flaticon.com/512/732/732200.png" 
                    alt="Email"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <SafeIcon 
                    src="https://cdn-icons-png.flaticon.com/512/159/159478.png" 
                    alt="Lock"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <SafeIcon 
                      src={showPassword 
                        ? "https://cdn-icons-png.flaticon.com/512/709/709612.png"
                        : "https://cdn-icons-png.flaticon.com/512/709/709586.png"
                      } 
                      alt={showPassword ? "Hide Password" : "Show Password"}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              {/* Forgot Password Link - Only show on login */}
              {authMode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={openForgotPasswordModal}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => switchAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {authMode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Reset Password</h3>
              <button
                onClick={closeForgotPasswordModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon 
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828778.png" 
                  alt="Close"
                  className="w-6 h-6"
                />
              </button>
            </div>

            {forgotPasswordStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon 
                    src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                    alt="Success"
                    className="w-8 h-8"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Check Your Email
                </h4>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <strong>{forgotPasswordEmail}</strong>
                </p>
                <button
                  onClick={closeForgotPasswordModal}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {forgotPasswordStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                    <SafeIcon 
                      src="https://cdn-icons-png.flaticon.com/512/564/564619.png" 
                      alt="Error"
                      className="w-5 h-5"
                    />
                    <span className="text-red-800">
                      Failed to send reset email. Please try again.
                    </span>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <SafeIcon 
                        src="https://cdn-icons-png.flaticon.com/512/732/732200.png" 
                        alt="Email"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      />
                      <input
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmittingForgotPassword}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingForgotPassword ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <button
                      type="button"
                      onClick={closeForgotPasswordModal}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Demo Chatbot */}
      <DemoChatbot />
    </div>
  );
};

export default LandingPage;