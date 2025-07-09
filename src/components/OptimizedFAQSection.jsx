import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

const OptimizedFAQSection = () => {
  const faqs = [
    {
      question: "What is NPOBots?",
      answer: "NPOBots is a chatbot builder made specifically for nonprofit organizations. It lets you add a customizable chatbot to your website to help engage visitors, collect donations, recruit volunteers, and more—without needing to write a single line of code.",
      category: "general"
    },
    {
      question: "How long does it take to set up a chatbot?",
      answer: "Most users can launch their chatbot in under 10 minutes. Our intuitive builder makes setup fast and frustration-free.",
      category: "setup"
    },
    {
      question: "What can the chatbot do?",
      answer: "Your chatbot can play a welcome video, offer click-to-call and email buttons, collect volunteer sign-up information, and accept donations in preset or custom amounts.",
      category: "features"
    },
    {
      question: "Do I need technical skills to use NPOBots?",
      answer: "Not at all. If you can use email or update a Facebook page, you can use NPOBots. We've designed everything to be simple, intuitive, and user-friendly.",
      category: "technical"
    },
    {
      question: "Is the chatbot customizable?",
      answer: "Yes! You can update your bot's message, upload a custom welcome video, change donation amounts, add your branding, and more—all from your dashboard.",
      category: "customization"
    },
    {
      question: "Can I integrate NPOBots with my existing website?",
      answer: "Yes, our chatbot can be embedded on any website platform, including WordPress, Wix, Squarespace, and more. Just copy and paste a code script into your site.",
      category: "integration"
    },
    {
      question: "Is donor and volunteer data secure?",
      answer: "Absolutely. We use SSL encryption and follow strict data privacy standards to ensure your supporter information is safe and secure.",
      category: "security"
    },
    {
      question: "How much does it cost?",
      answer: "We offer an affordable price point for nonprofits of all sizes, just $99 per month.",
      category: "pricing"
    }
  ];

  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "Frequently Asked Questions about NPO Bots",
    "description": "Common questions and answers about NPO Bots chatbot platform for nonprofits",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
        "inLanguage": "en-US"
      }
    }))
  };

  return (
    <section className="py-20 bg-white" id="faq" aria-labelledby="faq-heading">
      {/* FAQ Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <SafeIcon 
                src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" 
                alt="Help Circle" 
                className="w-6 h-6" 
              />
            </div>
          </div>
          <h2 id="faq-heading" className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 mx-auto max-w-2xl">
            Everything you need to know about NPOBots
          </p>
          
          {/* Voice Search Optimized Subtitle */}
          <div className="sr-only">
            <h3>Common Questions About Nonprofit Chatbots</h3>
            <p>Get answers to the most frequently asked questions about NPO Bots, including pricing, setup time, features, and integration options for nonprofit organizations.</p>
          </div>
        </header>

        <div className="space-y-4" role="region" aria-labelledby="faq-heading">
          {faqs.map((faq, index) => (
            <motion.article
              key={index}
              className={`border rounded-lg overflow-hidden ${
                openIndex === index ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              itemScope
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <h3 
                  className="text-lg font-medium text-gray-900"
                  itemProp="name"
                >
                  {faq.question}
                </h3>
                <SafeIcon 
                  src={openIndex === index 
                    ? "https://cdn-icons-png.flaticon.com/512/892/892692.png" 
                    : "https://cdn-icons-png.flaticon.com/512/892/892685.png"
                  } 
                  alt={openIndex === index ? "Collapse answer" : "Expand answer"}
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
                id={`faq-answer-${index}`}
                aria-labelledby={`faq-question-${index}`}
                role="region"
              >
                <div 
                  className="px-6 pb-4 text-gray-600"
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">{faq.answer}</span>
                </div>
              </motion.div>
            </motion.article>
          ))}
        </div>

        {/* Additional Voice Search Content */}
        <div className="mt-16 sr-only">
          <h3>Quick Answers for Voice Search</h3>
          <div>
            <h4>How much does a nonprofit chatbot cost?</h4>
            <p>NPO Bots costs $99 per month for a complete chatbot solution designed specifically for nonprofits.</p>
          </div>
          <div>
            <h4>What is the best chatbot for nonprofits?</h4>
            <p>NPO Bots is the leading chatbot platform built specifically for nonprofit organizations, featuring donation collection, volunteer recruitment, and supporter engagement tools.</p>
          </div>
          <div>
            <h4>How do I add a chatbot to my nonprofit website?</h4>
            <p>Simply copy and paste NPO Bots' code script into your website. It works with WordPress, Wix, Squarespace, and all major platforms.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OptimizedFAQSection;