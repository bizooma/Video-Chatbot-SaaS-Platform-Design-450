import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

const VeteranOwnedSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l15 15v-30l-15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SafeIcon 
              src="https://cdn-icons-png.flaticon.com/512/197/197484.png" 
              alt="Flag"
              className="w-10 h-10"
            />
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Proudly Veteran-Owned
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Supporting nonprofits with the same dedication and integrity we brought to serving our country
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" 
                alt="Shield"
                className="w-8 h-8"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Veteran-Owned</h3>
            <p className="text-blue-100">
              Founded and led by veterans who understand the importance of mission, service, and making a difference
            </p>
          </motion.div>

          <motion.div
            className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" 
                alt="Users"
                className="w-8 h-8"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">100% U.S. Staff</h3>
            <p className="text-blue-100">
              Every team member is based in the United States, ensuring quality support and data security
            </p>
          </motion.div>

          <motion.div
            className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/833/833472.png" 
                alt="Heart"
                className="w-8 h-8"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Mission-Driven</h3>
            <p className="text-blue-100">
              We believe in the power of nonprofits and are committed to helping them amplify their impact
            </p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100 text-sm">Veteran-Owned</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100 text-sm">U.S. Based Staff</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100 text-sm">Support Available</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">🇺🇸</div>
              <div className="text-blue-100 text-sm">Made in USA</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-8 py-4">
            <div className="flex items-center space-x-2">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" 
                alt="Star"
                className="w-5 h-5"
              />
              <span className="text-white font-medium">Certified Veteran-Owned Small Business</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center space-x-2">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/2583/2583788.png" 
                alt="Award"
                className="w-5 h-5"
              />
              <span className="text-white font-medium">SBA Verified</span>
            </div>
          </div>
          <p className="text-blue-100 mt-6 max-w-2xl mx-auto">
            When you choose NPO Bots, you're supporting a veteran-owned business that's dedicated to helping nonprofits succeed. We bring military precision, integrity, and commitment to every client relationship.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VeteranOwnedSection;