import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { paymentPlans, redirectToCheckout } from '../lib/stripe';
import { sendEmail } from '../services/emailService';

const PricingSection = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handlePurchase = (paymentLink) => {
    redirectToCheckout(paymentLink);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const emailData = {
        name: contactForm.name,
        email: contactForm.email,
        message: `Contact Form Submission:
        
Name: ${contactForm.name}
Email: ${contactForm.email}
Phone: ${contactForm.phone || 'Not provided'}
Company: ${contactForm.company || 'Not provided'}

Message:
${contactForm.message}`,
        chatbotId: 'contact-form',
        recipientEmail: 'joe@bizooma.com'
      };

      const result = await sendEmail(emailData);

      if (result.success) {
        if (result.fallback && result.mailtoLink) {
          // Handle mailto fallback
          window.location.href = result.mailtoLink;
          setSubmitStatus('mailto');
        } else {
          setSubmitStatus('success');
          // Reset form on success
          setContactForm({
            name: '',
            email: '',
            phone: '',
            company: '',
            message: ''
          });
        }
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  // Load Calendly script
  useEffect(() => {
    // Check if Calendly script is already loaded
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pricing Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 mx-auto max-w-2xl">
            Choose the plan that fits your nonprofit's needs
          </p>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center mb-20">
          <div className="grid gap-8 max-w-md">
            {paymentPlans.map((plan, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 ring-2 ring-blue-500 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 mb-6">
                    ${plan.amount}
                    <span className="text-lg text-gray-600 font-normal">
                      /{plan.interval}
                    </span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center space-x-3">
                      <SafeIcon 
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                        alt="Check"
                        className="w-4 h-4"
                      />
                      <span className="text-gray-600">1 Chatbot on 1 Website</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <SafeIcon 
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                        alt="Check"
                        className="w-4 h-4"
                      />
                      <span className="text-gray-600">Advanced Analytics</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <SafeIcon 
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                        alt="Check"
                        className="w-4 h-4"
                      />
                      <span className="text-gray-600">Priority Support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <SafeIcon 
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                        alt="Check"
                        className="w-4 h-4"
                      />
                      <span className="text-gray-600">Custom Branding</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <SafeIcon 
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                        alt="Check"
                        className="w-4 h-4"
                      />
                      <span className="text-gray-600">Nonprofit Features</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePurchase(plan.paymentLink)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon 
                      src="https://cdn-icons-png.flaticon.com/512/633/633611.png" 
                      alt="Credit Card"
                      className="w-5 h-5"
                    />
                    <span>Get Started</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-20 text-center">
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                alt="Check"
                className="w-4 h-4"
              />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                alt="Check"
                className="w-4 h-4"
              />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                alt="Check"
                className="w-4 h-4"
              />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Contact and Scheduling Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-12">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Contact us or schedule a demo to see how NPO Bots can transform your nonprofit's online engagement
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-0">
            {/* Contact Form Column */}
            <div className="p-8 lg:p-12 bg-gray-50">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <SafeIcon 
                    src="https://cdn-icons-png.flaticon.com/512/732/732200.png" 
                    alt="Email"
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">Contact Us</h4>
                  <p className="text-gray-600">Have questions? We'd love to hear from you.</p>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your nonprofit name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us about your nonprofit and how we can help..."
                    required
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
                  >
                    <SafeIcon 
                      src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                      alt="Success"
                      className="w-5 h-5"
                    />
                    <span className="text-green-800">Message sent successfully! We'll get back to you soon.</span>
                  </motion.div>
                )}

                {submitStatus === 'mailto' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2"
                  >
                    <SafeIcon 
                      src="https://cdn-icons-png.flaticon.com/512/732/732200.png" 
                      alt="Email"
                      className="w-5 h-5"
                    />
                    <span className="text-blue-800">Opening your email client to send the message.</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
                  >
                    <SafeIcon 
                      src="https://cdn-icons-png.flaticon.com/512/564/564619.png" 
                      alt="Error"
                      className="w-5 h-5"
                    />
                    <span className="text-red-800">Failed to send message. Please try again or email us directly at joe@bizooma.com</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon 
                        src="https://cdn-icons-png.flaticon.com/512/3682/3682321.png" 
                        alt="Send"
                        className="w-5 h-5"
                      />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center">
                  <SafeIcon 
                    src="https://cdn-icons-png.flaticon.com/512/159/159832.png" 
                    alt="Phone"
                    className="w-4 h-4 mr-2"
                  />
                  Or call us directly: <a href="tel:8453779730" className="font-semibold ml-1 hover:underline">845-377-9730</a>
                </p>
              </div>
            </div>

            {/* Calendly Column */}
            <div className="p-8 lg:p-12 bg-white">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <SafeIcon 
                    src="https://cdn-icons-png.flaticon.com/512/2693/2693507.png" 
                    alt="Calendar"
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">Schedule a Demo</h4>
                  <p className="text-gray-600">Book a 30-minute demo to see NPO Bots in action.</p>
                </div>
              </div>

              {/* Calendly Inline Widget */}
              <div className="calendly-inline-widget" data-url="https://calendly.com/joe-bizooma/30min" style={{minWidth: '320px', height: '700px'}}></div>
              
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <SafeIcon 
                    src="https://cdn-icons-png.flaticon.com/512/2693/2693507.png" 
                    alt="Clock"
                    className="w-4 h-4"
                  />
                  <span>30-minute personalized demo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon 
                    src="https://cdn-icons-png.flaticon.com/512/1370/1370907.png" 
                    alt="Chat"
                    className="w-4 h-4"
                  />
                  <span>See live chatbot examples</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon 
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" 
                    alt="Question"
                    className="w-4 h-4"
                  />
                  <span>Get all your questions answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon 
                    src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                    alt="No Cost"
                    className="w-4 h-4"
                  />
                  <span>No cost, no obligation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;