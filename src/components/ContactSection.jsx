import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

const ContactSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751999995902-shutterstock_573855649.png"
          alt="Contact Us Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Contact Us
          </h2>
          <p className="text-xl text-blue-100 mb-6 drop-shadow-md mx-auto max-w-2xl">
            We're Here to Help
          </p>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto drop-shadow-md">
            Whether you have a question, need help setting up your bot, or just want to see how NPOBots can fit your organization, we're here for you.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 flex items-start space-x-4 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/732/732200.png" 
                alt="Email"
                className="w-6 h-6"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <a
                href="mailto:joe@bizooma.com"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                joe@bizooma.com
              </a>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 flex items-start space-x-4 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-green-100 p-3 rounded-full">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/159/159832.png" 
                alt="Phone"
                className="w-6 h-6"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Call</h3>
              <a
                href="tel:8453779730"
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                845-377-9730
              </a>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 flex items-start space-x-4 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-orange-100 p-3 rounded-full">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/2693/2693507.png" 
                alt="Clock"
                className="w-6 h-6"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
              <p className="text-gray-600">Monday–Friday, 9 AM–5 PM ET</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 flex items-start space-x-4 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-purple-100 p-3 rounded-full">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png" 
                alt="Map Pin"
                className="w-6 h-6"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
              <p className="text-gray-600">
                2465 US-1S, Suite 1045<br />
                St. Augustine, FL 32086
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;