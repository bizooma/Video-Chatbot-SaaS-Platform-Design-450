import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { paymentPlans, redirectToCheckout } from '../lib/stripe';

const { FiCheck, FiCreditCard } = FiIcons;

const PricingSection = () => {
  const handlePurchase = (paymentLink) => {
    redirectToCheckout(paymentLink);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your nonprofit's needs
          </p>
        </div>
        <div className="flex justify-center">
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
                    <span className="text-lg text-gray-600 font-normal"> /{plan.interval}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center space-x-3">
                      <SafeIcon icon={FiCheck} className="text-green-500 text-sm" />
                      <span className="text-gray-600">Unlimited Video Chatbots</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <SafeIcon icon={FiCheck} className="text-green-500 text-sm" />
                      <span className="text-gray-600">Advanced Analytics</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <SafeIcon icon={FiCheck} className="text-green-500 text-sm" />
                      <span className="text-gray-600">Priority Support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <SafeIcon icon={FiCheck} className="text-green-500 text-sm" />
                      <span className="text-gray-600">Custom Branding</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <SafeIcon icon={FiCheck} className="text-green-500 text-sm" />
                      <span className="text-gray-600">Nonprofit Features</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePurchase(plan.paymentLink)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiCreditCard} />
                    <span>Get Started</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-green-500" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-green-500" />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;