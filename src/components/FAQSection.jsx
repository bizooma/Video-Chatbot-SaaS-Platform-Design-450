import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

const FAQSection = () => {
  const faqs = [
    {
      question: "What is NPOBots?",
      answer: "NPOBots is a chatbot builder made specifically for nonprofit organizations. It lets you add a customizable chatbot to your website to help engage visitors, collect donations, recruit volunteers, and more—without needing to write a single line of code."
    },
    {
      question: "How long does it take to set up a chatbot?",
      answer: "Most users can launch their chatbot in under 10 minutes. Our intuitive builder makes setup fast and frustration-free."
    },
    {
      question: "What can the chatbot do?",
      answer: "Your chatbot can play a welcome video, offer click-to-call and email buttons, collect volunteer sign-up information, and accept donations in preset or custom amounts."
    },
    {
      question: "Do I need technical skills to use NPOBots?",
      answer: "Not at all. If you can use email or update a Facebook page, you can use NPOBots. We've designed everything to be simple, intuitive, and user-friendly."
    },
    {
      question: "Is the chatbot customizable?",
      answer: "Yes! You can update your bot's message, upload a custom welcome video, change donation amounts, add your branding, and more—all from your dashboard."
    },
    {
      question: "Can I integrate NPOBots with my existing website?",
      answer: "Yes, our chatbot can be embedded on any website platform, including WordPress, Wix, Squarespace, and more. Just copy and paste a code script into your site."
    },
    {
      question: "Is donor and volunteer data secure?",
      answer: "Absolutely. We use SSL encryption and follow strict data privacy standards to ensure your supporter information is safe and secure."
    },
    {
      question: "How much does it cost?",
      answer: "We offer an affordable price point for nonprofits of all sizes, just $99 per month."
    }
  ];

  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" 
                alt="Help Circle"
                className="w-6 h-6"
              />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 mx-auto max-w-2xl">
            Everything you need to know about NPOBots
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`border rounded-lg overflow-hidden ${
                openIndex === index ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <SafeIcon 
                  src={openIndex === index 
                    ? "https://cdn-icons-png.flaticon.com/512/892/892692.png"
                    : "https://cdn-icons-png.flaticon.com/512/892/892685.png"
                  } 
                  alt={openIndex === index ? "Chevron Up" : "Chevron Down"}
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? 'text-blue-600' : 'text-gray-500'
                  }`}
                />
              </button>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;