import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMessageCircle, FiMail, FiPhone, FiX, FiPlay, FiPause, FiSend, FiHeart, FiUsers } = FiIcons;

const ChatbotPreview = ({ chatbot }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: chatbot?.welcomeMessage || 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const videoRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user'
      };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: 'Thanks for your message! Our team will get back to you soon.',
          sender: 'bot'
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${chatbot?.email || 'support@example.com'}`;
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${chatbot?.phone || '+1-555-123-4567'}`;
  };

  const handleVolunteerClick = () => {
    if (chatbot?.volunteerUrl) {
      window.open(chatbot.volunteerUrl, '_blank');
    } else {
      const volunteerMessage = {
        id: Date.now(),
        text: 'Thank you for your interest in volunteering! Someone from our team will contact you soon about volunteer opportunities.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, volunteerMessage]);
    }
  };

  const handleDonationClick = (amount) => {
    if (chatbot?.donationUrl) {
      // Add amount parameter to donation URL if configured
      const url = chatbot.donationUrl.includes('?') 
        ? `${chatbot.donationUrl}&amount=${amount}`
        : `${chatbot.donationUrl}?amount=${amount}`;
      window.open(url, '_blank');
    } else {
      const donationMessage = {
        id: Date.now(),
        text: `Thank you for your generous donation of $${amount}! This will make a real difference in our mission.`,
        sender: 'bot'
      };
      setMessages(prev => [...prev, donationMessage]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-80 h-[500px] mb-4 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{chatbot?.name || 'Customer Support'}</h3>
                <button
                  onClick={toggleChatbot}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-lg" />
                </button>
              </div>
            </div>

            {/* Video Section */}
            {chatbot?.video && (
              <div className="relative bg-black">
                <video
                  ref={videoRef}
                  src={chatbot.video}
                  className="w-full h-32 object-cover"
                  controls={false}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onEnded={() => setIsVideoPlaying(false)}
                />
                <button
                  onClick={toggleVideo}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors"
                >
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <SafeIcon
                      icon={isVideoPlaying ? FiPause : FiPlay}
                      className="text-gray-800 text-xl"
                    />
                  </div>
                </button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            {chatbot?.chatEnabled && (
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <SafeIcon icon={FiSend} className="text-sm" />
                  </button>
                </div>
              </div>
            )}

            {/* Volunteer Button */}
            {chatbot?.volunteerEnabled && (
              <div className="px-4 pb-2">
                <button
                  onClick={handleVolunteerClick}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <SafeIcon icon={FiUsers} className="text-lg" />
                  <span>I Want to Volunteer</span>
                </button>
              </div>
            )}

            {/* Donation Buttons */}
            {chatbot?.donationEnabled && chatbot?.donationAmounts?.length > 0 && (
              <div className="px-4 pb-2">
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 text-center">Quick Donation</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {chatbot.donationAmounts.map((amount, index) => (
                    <button
                      key={index}
                      onClick={() => handleDonationClick(amount)}
                      className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1 font-medium text-sm"
                    >
                      <SafeIcon icon={FiHeart} className="text-sm" />
                      <span>${amount}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Action Buttons */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex space-x-2">
                {chatbot?.emailEnabled && (
                  <button
                    onClick={handleEmailClick}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                  >
                    <SafeIcon icon={FiMail} className="text-sm" />
                    <span>Email</span>
                  </button>
                )}

                {chatbot?.phoneEnabled && (
                  <button
                    onClick={handlePhoneClick}
                    className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                  >
                    <SafeIcon icon={FiPhone} className="text-sm" />
                    <span>Call</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={toggleChatbot}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: [0, -4, 0],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <SafeIcon icon={FiMessageCircle} className="text-xl" />
      </motion.button>
    </div>
  );
};

export default ChatbotPreview;