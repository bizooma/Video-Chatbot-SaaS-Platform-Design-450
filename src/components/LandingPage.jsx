import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import DemoChatbot from './DemoChatbot';
import PricingSection from './PricingSection';
import VeteranOwnedSection from './VeteranOwnedSection';
import FAQSection from './FAQSection';
import ContactSection from './ContactSection';
// Import analytics
import { trackPageView, trackSignup, trackLogin } from '../utils/analytics';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', company: '' });
  // ... other state

  const { login, signup, authError } = useAuth();
  const navigate = useNavigate();

  // Track page view on component mount
  useEffect(() => {
    trackPageView('/', 'NPO Bots - Home');
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
        trackLogin('email'); // Track successful login
      } else {
        await signup(formData.email, formData.password, {
          name: formData.name,
          company: formData.company
        });
        trackSignup('email'); // Track successful signup
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  // Rest of the component remains the same
  return (
    <>
      {/* Your existing JSX */}
    </>
  );
};

export default LandingPage;