import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { saveVolunteerInfo } from '../services/volunteerService';
import { sendEmail } from '../services/emailService';
// Import analytics
import { trackDemoInteraction, trackVolunteerSignup, trackContactForm } from '../utils/analytics';

const DemoChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [volunteerData, setVolunteerData] = useState({
    name: '',
    email: '',
    phone: '',
    availableDays: ''
  });
  const [emailData, setEmailData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Track demo interaction
    trackDemoInteraction('chat_message');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: 'Thanks for your message! How can I help you today?',
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleVolunteerFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus('');
    
    try {
      const result = await saveVolunteerInfo(volunteerData);
      if (result.success) {
        // Track volunteer signup
        trackVolunteerSignup();
        setSubmissionStatus('success');
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: 'Thank you for volunteering! We\'ll be in touch soon.',
          sender: 'bot'
        }]);
        setShowVolunteerForm(false);
        // Reset form
        setVolunteerData({
          name: '',
          email: '',
          phone: '',
          availableDays: ''
        });
      }
    } catch (error) {
      console.error('Volunteer submission error:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus('');
    
    try {
      const result = await sendEmail({
        ...emailData,
        chatbotId: 'demo',
        recipientEmail: 'joe@bizooma.com'
      });
      
      if (result.success) {
        // Track contact form submission
        trackContactForm('demo_chatbot');
        setSubmissionStatus('success');
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: 'Thank you for your message! We\'ll get back to you soon.',
          sender: 'bot'
        }]);
        setShowEmailForm(false);
        // Reset form
        setEmailData({
          name: '',
          email: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Email submission error:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonationClick = (amount) => {
    // Track donation button click
    trackDemoInteraction(`donation_${amount}`);
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: `Thank you for your $${amount} donation!`,
      sender: 'bot'
    }]);
  };

  // Rest of the component remains the same
  return (
    <>
      {/* Your existing JSX */}
    </>
  );
};

export default DemoChatbot;