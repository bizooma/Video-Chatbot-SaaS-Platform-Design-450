import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLock, FiStar, FiArrowRight, FiZap } = FiIcons;

const UpgradeBanner = ({ plan, featureTitle, featureDescription, onUpgradeClick }) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start space-x-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <SafeIcon icon={FiLock} className="text-white text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">
            Unlock {featureTitle || 'Premium Features'}
          </h3>
          <p className="text-blue-100 mb-4">
            {featureDescription || `This feature is available on our ${plan || 'Pro'} plan and higher. Upgrade to access this and many more premium features.`}
          </p>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
              <SafeIcon icon={FiStar} className="text-yellow-300" />
              <span className="text-white text-sm">AI Training</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
              <SafeIcon icon={FiZap} className="text-yellow-300" />
              <span className="text-white text-sm">Advanced Analytics</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
              <SafeIcon icon={FiStar} className="text-yellow-300" />
              <span className="text-white text-sm">Priority Support</span>
            </div>
          </div>
          <button
            onClick={onUpgradeClick}
            className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
          >
            <span>Upgrade Now</span>
            <SafeIcon icon={FiArrowRight} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UpgradeBanner;