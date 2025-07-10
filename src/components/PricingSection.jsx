import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { redirectToCheckout } from '../lib/stripe';
import { sendEmail } from '../services/emailService';
// Import analytics
import { trackPricingView, trackPurchaseIntent, trackContactForm } from '../utils/analytics';

const PricingSection = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState('');

  // Track pricing section view
  useEffect(() => {
    trackPricingView('pro');
  }, []);

  const handlePurchase = (paymentLink) => {
    // Track purchase intent
    trackPurchaseIntent('pro', 99);
    redirectToCheckout(paymentLink);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('');
    
    try {
      const result = await sendEmail({
        ...contactForm,
        chatbotId: 'pricing_inquiry',
        recipientEmail: 'joe@bizooma.com'
      });
      
      if (result.success) {
        // Track contact form submission
        trackContactForm('pricing_contact');
        setFormStatus('success');
        setTimeout(() => {
          setShowContactForm(false);
          setContactForm({
            name: '',
            email: '',
            company: '',
            message: ''
          });
          setFormStatus('');
        }, 3000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of the component remains the same
  return (
    <>
      {/* Your existing JSX */}
    </>
  );
};

export default PricingSection;