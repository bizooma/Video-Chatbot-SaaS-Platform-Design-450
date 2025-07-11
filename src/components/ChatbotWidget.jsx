import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const ChatbotWidget = ({ config = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: config.welcomeMessage || 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [volunteerData, setVolunteerData] = useState({
    name: '',
    email: '',
    phone: '',
    availableDays: 'Weekdays'
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  
  const videoRef = useRef(null);
  const toggleVideoRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    
    // Pause video in toggle button when opening the chat
    if (!isOpen) {
      if (toggleVideoRef.current) {
        toggleVideoRef.current.pause();
      }
    } else {
      // Resume video in toggle button when closing the chat
      if (toggleVideoRef.current && config.video) {
        toggleVideoRef.current.play().catch(e => console.log("Auto-play prevented:", e));
      }
    }
  };

  const toggleVideo = () => {
    // For YouTube videos, control the iframe
    if (config.videoType === 'youtube') {
      const iframe = videoRef.current;
      if (iframe) {
        // Toggle play/pause by sending postMessage to YouTube iframe
        if (isVideoPlaying) {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } else {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
        setIsVideoPlaying(!isVideoPlaying);
      }
      return;
    }

    // For regular video files
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
      const newMessage = { id: Date.now(), text: inputMessage, sender: 'user' };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');

      // Simulate bot response
      setTimeout(() => {
        const botResponse = { 
          id: Date.now() + 1, 
          text: 'Thanks for your message! Our team will get back to you soon.', 
          sender: 'bot' 
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleEmailClick = () => {
    if (config.emailEnabled) {
      setShowContactForm(true);
    } else {
      window.location.href = `mailto:${config.email || 'support@example.com'}`;
    }
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${config.phone || '+1-555-123-4567'}`;
  };

  const handleVolunteerClick = () => {
    setShowVolunteerForm(true);
  };

  const handleDonationClick = (amount) => {
    // Handle donation with amount
    const donationMessage = { 
      id: Date.now(), 
      text: `Thank you for your generous donation of $${amount}! This will make a real difference in our mission.`, 
      sender: 'bot' 
    };
    setMessages(prev => [...prev, donationMessage]);
    
    // If donation URL is configured, redirect
    if (config.donationUrl) {
      const url = config.donationUrl.includes('?') 
        ? `${config.donationUrl}&amount=${amount}` 
        : `${config.donationUrl}?amount=${amount}`;
      window.open(url, '_blank');
    }
  };

  const submitVolunteerForm = (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setFormSubmitting(false);
      setFormStatus('success');
      
      // Add confirmation message to chat
      const confirmationMessage = { 
        id: Date.now(), 
        text: 'Thank you for volunteering! We\'ll be in touch with you soon about volunteer opportunities.', 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, confirmationMessage]);
      
      // Reset and close form after delay
      setTimeout(() => {
        setShowVolunteerForm(false);
        setVolunteerData({
          name: '',
          email: '',
          phone: '',
          availableDays: 'Weekdays'
        });
        setFormStatus('');
      }, 3000);
    }, 1500);
  };

  const submitContactForm = (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setFormSubmitting(false);
      setFormStatus('success');
      
      // Add confirmation message to chat
      const confirmationMessage = { 
        id: Date.now(), 
        text: 'Thank you for your message! We\'ll get back to you as soon as possible.', 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, confirmationMessage]);
      
      // Reset and close form after delay
      setTimeout(() => {
        setShowContactForm(false);
        setContactData({
          name: '',
          email: '',
          message: ''
        });
        setFormStatus('');
      }, 3000);
    }, 1500);
  };

  // Start playing toggle video when component mounts
  useEffect(() => {
    if (toggleVideoRef.current && config.video && !isOpen) {
      toggleVideoRef.current.play().catch(e => console.log("Auto-play prevented:", e));
      
      // Loop the video
      toggleVideoRef.current.loop = true;
      
      // Mute the video to allow autoplay
      toggleVideoRef.current.muted = true;
    }
  }, [config.video, isOpen]);

  // Get theme colors from config or use defaults
  const theme = config.theme || {
    primaryColor: '#3b82f6',
    textColor: '#ffffff',
    backgroundColor: '#ffffff',
    secondaryColor: '#f3f4f6'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-xl shadow-2xl mb-4 flex flex-col overflow-hidden"
            style={{ 
              width: '380px',
              height: '600px',
              position: 'fixed',
              bottom: '80px',
              right: '20px'
            }}
          >
            {/* Header */}
            <div 
              className="text-white p-4 flex-shrink-0"
              style={{ background: theme.primaryColor }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">{config.name || 'Customer Support'}</h3>
                <button onClick={toggleChatbot} className="text-white hover:text-gray-200 transition-colors">
                  <FiIcons.FiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* Video Section */}
            {config.video && (
              <div className="relative bg-black h-40 flex-shrink-0">
                {config.videoType === 'youtube' ? (
                  // YouTube iframe embed with API enabled
                  <iframe
                    ref={videoRef}
                    src={`${config.video}&enablejsapi=1&origin=${window.location.origin}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Demo Video"
                  />
                ) : (
                  // Regular video file
                  <video
                    ref={videoRef}
                    src={config.video}
                    className="w-full h-full object-cover"
                    controls={false}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                  />
                )}
                
                {/* Video play/pause overlay */}
                {!config.videoType && (
                  <button 
                    onClick={toggleVideo} 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors"
                  >
                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <SafeIcon 
                        icon={isVideoPlaying ? FiIcons.FiPause : FiIcons.FiPlay} 
                        className="text-gray-800 text-xl" 
                      />
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 shadow-sm border'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Volunteer Form */}
            {showVolunteerForm && (
              <div className="p-4 border-t bg-white">
                <h4 className="font-medium text-gray-900 mb-3">Volunteer Sign-Up</h4>
                
                {formStatus === 'success' && (
                  <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Thank you for volunteering! We'll be in touch with you soon.
                  </div>
                )}
                
                <form onSubmit={submitVolunteerForm}>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={volunteerData.name}
                        onChange={(e) => setVolunteerData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={volunteerData.email}
                        onChange={(e) => setVolunteerData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Email Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={volunteerData.phone}
                        onChange={(e) => setVolunteerData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone Number (Optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <select
                        value={volunteerData.availableDays}
                        onChange={(e) => setVolunteerData(prev => ({ ...prev, availableDays: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Weekdays">Weekdays</option>
                        <option value="Weekends">Weekends</option>
                        <option value="Both">Both Weekdays & Weekends</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {formSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowVolunteerForm(false)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Contact Form */}
            {showContactForm && (
              <div className="p-4 border-t bg-white">
                <h4 className="font-medium text-gray-900 mb-3">Contact Us</h4>
                
                {formStatus === 'success' && (
                  <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}
                
                <form onSubmit={submitContactForm}>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={contactData.name}
                        onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Email Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <textarea
                        value={contactData.message}
                        onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Your Message"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {formSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Input */}
            {!showVolunteerForm && !showContactForm && (
              <>
                {/* Chat input */}
                {config.chatEnabled !== false && (
                  <div className="p-3 border-t flex-shrink-0">
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
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        <FiIcons.FiSend className="text-sm" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Volunteer Button */}
                {config.volunteerEnabled && (
                  <div className="px-3 pb-2 flex-shrink-0">
                    <button
                      onClick={handleVolunteerClick}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium text-sm"
                    >
                      <FiIcons.FiUsers className="text-base" />
                      <span>I Want to Volunteer</span>
                    </button>
                  </div>
                )}

                {/* Donation Buttons */}
                {config.donationEnabled && config.donationAmounts?.length > 0 && (
                  <div className="px-3 pb-2 flex-shrink-0">
                    <div className="mb-1">
                      <p className="text-xs font-medium text-gray-700 text-center">Quick Donation</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {(config.donationAmounts || [25, 50, 100, 250]).map((amount, index) => (
                        <button
                          key={index}
                          onClick={() => handleDonationClick(amount)}
                          className="bg-red-500 text-white py-1.5 px-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1 font-medium text-xs"
                        >
                          <FiIcons.FiHeart className="text-xs" />
                          <span>${amount}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Action Buttons */}
                <div className="p-3 bg-gray-50 border-t flex-shrink-0">
                  <div className="flex space-x-2">
                    {config.emailEnabled && (
                      <button
                        onClick={handleEmailClick}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-xs"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        <FiIcons.FiMail className="text-xs" />
                        <span>Email</span>
                      </button>
                    )}
                    {config.phoneEnabled && (
                      <button
                        onClick={handlePhoneClick}
                        className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1 text-xs"
                      >
                        <FiIcons.FiPhone className="text-xs" />
                        <span>Call</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Chatbot Toggle Button */}
      {config.video ? (
        <motion.div
          onClick={toggleChatbot}
          className="relative w-16 h-16 rounded-full shadow-lg hover:shadow-xl cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Video preview */}
          <video
            ref={toggleVideoRef}
            src={config.video}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
          />
          
          {/* Overlay to ensure visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
              <SafeIcon 
                icon={FiIcons.FiMessageCircle} 
                className="text-gray-800 text-sm" 
              />
            </div>
          </div>
        </motion.div>
      ) : (
        /* Fallback to standard button if no video */
        <motion.button
          onClick={toggleChatbot}
          className="text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
          style={{ backgroundColor: theme.primaryColor }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiIcons.FiMessageCircle className="text-xl" />
        </motion.button>
      )}
    </div>
  );
};

export default ChatbotWidget;